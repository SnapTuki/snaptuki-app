import { PrismaClient } from "@prisma/client";
import { BookingStatus } from "../../generated/prisma";
import { NewBookingInput, UpdatedBookingScheduelInput } from "./booking.inputs";
import { connect } from "http2";

export class BookingService {

    private dbClient: PrismaClient;

    constructor(db: PrismaClient) {
        this.dbClient = db;
    }

    /**
     * Get all bookings for a user (Family or Caregiver).
     * Includes relations needed for the 'BookingCard' UI.
     */
    public async getAllBookings(userId: number, filter?: BookingStatus) {
        return await this.dbClient.booking.findMany({
            where: {
                OR: [
                    { familyMemberId: Number(userId) },
                    { caregiverId: Number(userId) },
                ],
                ...(filter ? { status: filter } : {}),
            },
            include: {
                caregiver: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                elder: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /**
     * Get a single booking by ID.
     * Includes ALL relations for the detailed 'Booking' view.
     */
    public async getBooking(bookingId: number) {
        const booking = await this.dbClient.booking.findUnique({
            where: {
                id: Number(bookingId),
            },
            include: {
                caregiver: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        },
                    }
                },
                elder: true,
                careTaskBook: {
                    include: {
                        tasks: true
                    }
                }
            }
        });

        if (!booking) {
            throw new Error(`Booking with ID ${bookingId} not found`);
        }

        return booking;
    }


    public async getPendingBookings(userId: number) {
    const requests = await this.dbClient.booking.findMany({
        where: {
            caregiver: {
                userId: userId
            },
            status: BookingStatus.PENDING,
        },
        include: {
            // Includes the family member who initiated the request
            familyMember: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            },
            // Includes the elder receiving care and their location
            elder: true,
            // Includes the task list so the caregiver knows the job requirements
            careTaskBook: {
                include: {
                    tasks: true
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },

    });

    return requests;
}

    public async createBooking(bookingRecord: NewBookingInput) {
        if (bookingRecord.startTime >= bookingRecord.endTime) {
            throw new Error("Start time must be before end time");
        }

        return await this.dbClient.booking.create({
            data: {
                startTime: bookingRecord.startTime,
                endTime: bookingRecord.endTime,
                notes: bookingRecord.notes,
                status: BookingStatus.PENDING,
                totalPrice: bookingRecord.totalPrice,

                // ✅ REQUIRED nested relations
                familyMember: {
                    connect: { id: bookingRecord.familyMemberId },
                },
                elder: {
                    connect: { id: bookingRecord.elderId },
                },

                caregiver: {
                    connect: {id: bookingRecord.caregiverId}
                },

                careTaskBook: {
                    create: {
                        status: 'ACTIVE',
                        tasks: {
                            create: bookingRecord.tasks.map(t => ({
                                title: t.title,
                                //description: t.description,
                                isMandatory: t.isMandatory
                            }))
                        }
                    }
                }
            },
        });
    }


    public async cancelBooking(bookingId: number) {
        return this.dbClient.booking.update({
            where: {
                id: Number(bookingId),
            },
            data: {
                status: BookingStatus.CANCELLED,
            },
        });
    }

    // Confirm booking (caregiver accepts)
    public async confirmBooking(bookingId: number) {
        return this.dbClient.booking.update({
            where: {
                id: Number(bookingId),
            },
            data: {
                status: BookingStatus.CONFIRMED,
            },
        });
    }

    // Reschedule booking
    public async rescheduelBooking(bookingId: number, newScheduel: UpdatedBookingScheduelInput) {
        if (newScheduel.startTime >= newScheduel.endTime) {
            throw new Error("Start time must be before end time");
        }

        return this.dbClient.booking.update({
            where: {
                id: Number(bookingId),
            },
            data: {
                startTime: newScheduel.startTime,
                endTime: newScheduel.endTime,
                status: BookingStatus.PENDING,
            },
        });
    }

    // Complete booking
    public async completeBooking(bookingId: number) {
        return this.dbClient.booking.update({
            where: {
                id: Number(bookingId),
            },
            data: {
                status: BookingStatus.COMPLETED,
            },
        });
    }
}