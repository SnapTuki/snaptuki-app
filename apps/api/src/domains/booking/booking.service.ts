import { PrismaClient } from "@prisma/client";
import { BookingStatus } from "../../generated/prisma";
import { NewBookingInput, UpdatedBookingScheduelInput } from "./booking.inputs";

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
        return this.dbClient.booking.findMany({
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
                careService: true,
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
                                phoneNumber: true,
                            }
                        },
                        reviews: true // Optional: if you show reviews in booking details
                    }
                },
                elder: true,
                careService: true,
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

    public async createBooking(bookingRecord: NewBookingInput) {
        if (bookingRecord.startTime >= bookingRecord.endTime) {
            throw new Error("Start time must be before end time");
        }

        // Optional: Calculate total price here or in a separate method
        // const caregiver = await this.dbClient.caregiverProfile.findUnique(...)
        // const price = ...

        return this.dbClient.booking.create({
            data: {
                familyMemberId: bookingRecord.familyMemberId,
                elderId: bookingRecord.elderId,
                careServiceId: bookingRecord.serviceId,
                startTime: bookingRecord.startTime,
                endTime: bookingRecord.endTime,
                notes: bookingRecord.notes,
                status: BookingStatus.PENDING,
                totalPrice: 0, // Placeholder, should be calculated
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