import { PrismaClient } from "@prisma/client";

export class CareServiceService {
  private dbClient: PrismaClient;

  constructor(db: PrismaClient) {
    this.dbClient = db;
  }

  /** ----------------------------
   * SERVICE CATEGORIES
   * ---------------------------- */

  async createServiceCategory(data: {
    categoryName: string;
    description?: string;
  }) {
    return this.dbClient.serviceCategory.create({
      data: {
        category_name: data.categoryName,
        description: data.description,
      },
    });
  }

  async updateServiceCategory(
    categoryId: number,
    data: {
      category_name?: string;
      description?: string;
      is_active?: boolean;
    }
  ) {
    return this.dbClient.serviceCategory.update({
      where: { category_id: categoryId },
      data,
    });
  }

  async deleteServiceCategory(categoryId: number) {
    return this.dbClient.serviceCategory.delete({
      where: { category_id: categoryId },
    });
  }

  async getAllServiceCategories() {
    return await this.dbClient.serviceCategory.findMany({
        include: {
            serviceTasks: true
        }
    });
  }

  async getServiceCategoryById(categoryId: number) {
    return this.dbClient.serviceCategory.findUnique({
      where: { category_id: categoryId },
      include: {
        servicetasks: true,
      },
    });
  }

  /** ----------------------------
   * SERVICE TASKS
   * ---------------------------- */

  async createServiceTask(data: {
    categoryId: number;
    serviceName: string;
    description?: string;
  }) {
    return this.dbClient.serviceTask.create({
      data: {
        category_id: data.categoryId,
        service_name: data.serviceName,
        description: data.description,
      },
    });
  }

  async updateServiceTask(
    taskId: number,
    data: {
      service_name?: string;
      description?: string;
      is_active?: boolean;
    }
  ) {
    return this.dbClient.serviceTask.update({
      where: { id: taskId },
      data,
    });
  }

  async deleteServiceTask(taskId: number) {
    return this.dbClient.serviceTask.delete({
      where: { id: taskId },
    });
  }

  async getServiceTasksByCategory(categoryId: number) {
    return this.dbClient.serviceTask.findMany({
      where: {
        category_id: categoryId,
        is_active: true,
      },
      orderBy: {
        service_name: "asc",
      },
    });
  }

  async getServiceTaskById(taskId: number) {
    return this.dbClient.serviceTask.findUnique({
      where: { id: taskId },
    });
  }
}
