import { Arg, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { Booking } from "./booking.types";
import { NewBookingInput, UpdatedBookingScheduelInput } from "./booking.inputs";
import { GraphQLContext } from '../../context'

@Resolver()
export class BookingResolver {

    /** ----- QUERIES --------- */

    @Query(returns => [Booking]!)
    async getAllBookings(
        @Arg('userId') userId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking[]> {
        return ctx.services.bookingService.getAllBookings(userId);
    }

    @Query(() => Booking)
    async getBookingDetails(
        @Arg("bookingId") bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.getBooking(bookingId);
    }




    /** Mutations */
    @Mutation(() => Booking)
    async createNewBooking(
        @Arg("data") newBookingData: NewBookingInput,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.createBooking({
            familyMemberId: newBookingData.familyMemberId,
            caregiverId: newBookingData.caregiverId,
            elderId: newBookingData.elderId,
            serviceId: newBookingData.serviceId,
            startTime: newBookingData.startTime,
            endTime: newBookingData.endTime,
            notes: newBookingData.notes,
            totalPrice: newBookingData.totalPrice
        });
    }

    @Mutation(() => Booking)
    async rescheduelBooking(
        @Arg("bookingId") bookingId: number,
        @Arg("data") newScheduel: UpdatedBookingScheduelInput,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.rescheduelBooking(
            bookingId,
            newScheduel
        );
    }

    @Mutation(() => Booking)
    async cancleBooking(
        @Arg("bookingId") bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.cancelBooking(bookingId);
    }

    @Mutation(() => Booking)
    async confirmBooking(
        @Arg("bookingId") bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.confirmBooking(bookingId);
    }

    @Mutation(() => Booking)
    async completeBooking(
        @Arg("bookingId") bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.completeBooking(bookingId);
    }

}