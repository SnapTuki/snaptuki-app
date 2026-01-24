import { PrismaClient, CareTaskBookStatus, CareTaskStatus } from "../../generated/prisma";

export class CareTaskBookService {
    
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  /* =====================================================
     CREATE TASK BOOK (SYSTEM ACTION)
     Triggered when Booking is CONFIRMED
  ===================================================== */

  async createFromBooking(bookingId: number) {
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: {
        careService: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "CONFIRMED") {
      throw new Error("Task book can only be created for CONFIRMED bookings");
    }

    const existingTaskBook = await this.db.careTaskBook.findUnique({
      where: { bookingId: bookingId },
    });

    if (existingTaskBook) {
      return existingTaskBook;
    }

    // Create task book
    const taskBook = await this.db.careTaskBook.create({
      data: {
        bookingId: booking.id,
        caregiverId: booking.caregiverId,
        elderId: booking.elderId,
        status: CareTaskBookStatus.ACTIVE,
      },
    });

    // Generate default tasks (can be template-based later)
    await this.createDefaultTasks(taskBook.id, booking.careService.serviceName);

    return taskBook;
  }

  /* =====================================================
     CREATE DEFAULT TASKS
     (Internal helper)
  ===================================================== */

  private async createDefaultTasks(taskBookId: number, serviceName: string) {
    const defaultTasks = [
      { title: "Arrival & Check-in" , taskOrder: 1},
      { title: "Service Execution" , taskOrder: 2},
      { title: "Elder Wellbeing Check" , taskOrder: 3},
      { title: "Completion & Notes" , taskOrder: 4},
    ];

    await this.db.careTask.createMany({
      data: defaultTasks.map(task => ({
        taskBookId: taskBookId,
        title: `${serviceName}: ${task.title}`,
        status: CareTaskStatus.PENDING,
        taskOrder: task.taskOrder
      })),
    });
  }

  /* =====================================================
     GET TASK BOOK (READ)
  ===================================================== */

  async getTaskBookByBooking(bookingId: number) {
    return this.db.careTaskBook.findUnique({
      where: { bookingId: bookingId },
      include: {
        tasks: true,
      },
    });
  }

  async getTaskBook(taskBookId: number) {
    return this.db.careTaskBook.findUnique({
      where: { id: taskBookId },
      include: {
        tasks: true,
      },
    });
  }

  /* =====================================================
     UPDATE TASK STATUS (CAREGIVER ACTION)
  ===================================================== */

  async updateTaskStatus(
    taskId: number,
    caregiverId: number,
    status: CareTaskStatus,
    notes?: string
  ) {
    const task = await this.db.careTask.findUnique({
      where: { id: taskId },
      include: {
        taskBook: true,
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.taskBook.caregiverId !== caregiverId) {
      throw new Error("Not authorized to update this task");
    }

    if (task.taskBook.status !== CareTaskBookStatus.ACTIVE) {
      throw new Error("Task book is not active");
    }

    const updatedTask = await this.db.careTask.update({
      where: { id: taskId },
      data: {
        status,
        caregiverNotes: notes,
        completedAt:
          status === CareTaskStatus.DONE ? new Date() : null,
      },
    });

    //await this.recalculateProgress(task.taskbook.id);

    return updatedTask;
  }

  /* =====================================================
     COMPLETE TASK BOOK (SYSTEM VALIDATION)
  ===================================================== */

  async completeTaskBook(taskBookId: number) {
    const taskBook = await this.db.careTaskBook.findUnique({
      where: { id: taskBookId },
      include: { tasks: true },
    });

    if (!taskBook) {
      throw new Error("Task book not found");
    }

    const incompleteTasks = taskBook.tasks.filter(
      t => t.status !== CareTaskStatus.DONE
    );

    if (incompleteTasks.length > 0) {
      throw new Error("All tasks must be completed before closing task book");
    }

    return this.db.careTaskBook.update({
      where: { id: taskBookId },
      data: {
        status: CareTaskBookStatus.COMPLETED,
      },
    });
  }

  /* =====================================================
     PROGRESS CALCULATION
  ===================================================== */

  /* private async recalculateProgress(taskBookId: number) {
    const tasks = await this.db.careTask.findMany({
      where: { task_book_id: taskBookId },
    });

    const total = tasks.length;
    const completed = tasks.filter(
      t => t.status === CareTaskStatus.DONE
    ).length;

    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    await this.db.careTaskBook.update({
      where: { id: taskBookId },
      data: {
        total_tasks: total,
        completed_tasks: completed,
        progress_percentage: progress,
      },
    });
  } */
}
