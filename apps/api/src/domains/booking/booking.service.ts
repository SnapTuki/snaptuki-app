import { PrismaClient } from "@prisma/client";
import { BookingStatus } from "../../generated/prisma";
import { NewBookingInput, UpdatedBookingScheduelInput } from "./booking.inputs";

export class BookingService {

    private dbClient: PrismaClient;

    constructor(db: PrismaClient) {
        this.dbClient = db;
    }


    public async getAllBookings(userId: string, filter?: BookingStatus) {
        return this.dbClient.booking.findMany({
            where: {
                OR: [
                    { family_member_id: Number(userId) },
                    { caregiver_id: Number(userId) },
                ],
                ...(filter ? { status: filter } : {}),
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }

    public async getBooking(bookingId: string) {
        return this.dbClient.booking.findUnique({
            where: {
                id: Number(bookingId),
            }
        });
    }

    public async createBooking(bookingRecord: NewBookingInput) {
        if (bookingRecord.startTime >= bookingRecord.endTime) {
            throw new Error("Start time must be before end time");
        }

        return this.dbClient.booking.create({
            data: {
                family_member_id: bookingRecord.familyMemberId,
                elder_id: bookingRecord.elderId,
                care_service_id: bookingRecord.serviceId,
                start_time: bookingRecord.startTime,
                end_time: bookingRecord.endTime,
                notes: bookingRecord.notes,
                status: BookingStatus.PENDING,
            },
        });
    }

    public async cancelBooking(bookingId: string) {
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
    public async confirmBooking(bookingId: string) {
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
    public async rescheduelBooking(bookingId: Number, newScheduel: UpdatedBookingScheduelInput) {
        if (newScheduel.startTime >= newScheduel.endTime) {
            throw new Error("Start time must be before end time");
        }

        return this.dbClient.booking.update({
            where: {
                id: Number(bookingId),
            },
            data: {
                start_time: newScheduel.startTime,
                end_time: newScheduel.endTime,
                status: BookingStatus.PENDING,
            },
        });
    }

    // Complete booking
    public async completeBooking(bookingId: string) {
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