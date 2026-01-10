import { Arg, Mutation, Query, Resolver, Ctx, ID } from "type-graphql";
import { Booking } from "./booking.types";
import { NewBookingInput, UpdatedBookingScheduelInput } from "./booking.inputs";
import { GraphQLContext } from '../../context'

@Resolver()
export class BookingResolver {

    /** ----- QUERIES --------- */

    @Query(returns => [Booking]!)
    async getAllBookings(
        @Arg("userId", ()=>ID) userId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking[]> {
        return ctx.services.bookingService.getAllBookings(userId);
    }

    @Query(() => Booking)
    async getBookingDetails(
        @Arg("bookingId", ()=>ID) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.getBooking(bookingId);
    }




    /** Mutations */
    @Mutation(() => Booking)
    async createNewBooking(
        @Arg("data", () => NewBookingInput) newBookingData: NewBookingInput,
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
        @Arg("bookingId", () => ID) bookingId: number,
        @Arg("data", ()=>UpdatedBookingScheduelInput) newScheduel: UpdatedBookingScheduelInput,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.rescheduelBooking(
            bookingId,
            newScheduel
        );
    }

    @Mutation(() => Booking)
    async cancleBooking(
        @Arg("bookingId", () => ID) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.cancelBooking(bookingId);
    }

    @Mutation(() => Booking)
    async confirmBooking(
        @Arg("bookingId", () => ID) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.confirmBooking(bookingId);
    }

    @Mutation(() => Booking)
    async completeBooking(
        @Arg("bookingId", () => ID) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ): Promise<Booking> {
        return ctx.services.bookingService.completeBooking(bookingId);
    }

}