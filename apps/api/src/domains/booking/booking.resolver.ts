import { Arg, Mutation, Query, Resolver, Ctx, Int } from "type-graphql";
import { Booking, BookingCard } from "./booking.types";
import { NewBookingInput, UpdatedBookingScheduelInput } from "./booking.inputs";
import { GraphQLContext } from '../../context'
import { BookingStatus } from "./booking.types";

@Resolver()
export class BookingResolver {

    /* ---------------- QUERIES ---------------- */

    /**
     * Get all bookings for the currently logged-in user.
     * Returns a lightweight 'BookingCard' list.
     */
    @Query(() => [BookingCard])
    async myBookings(
        @Ctx() ctx: GraphQLContext,
        @Arg("filter", () => BookingStatus, { nullable: true }) filter?: BookingStatus
    ) {
        if (!ctx.user) throw new Error("Not authenticated");
        return ctx.services.bookingService.getAllBookings(Number(ctx.user.id), filter);
    }

    /**
     * Get full details of a specific booking.
     */
    @Query(() => Booking)
    async getBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ) {
        // Optional: Add logic to check if ctx.user owns this booking
        return ctx.services.bookingService.getBooking(bookingId);
    }

    /* ---------------- MUTATIONS ---------------- */

    @Mutation(() => Booking)
    async createBooking(
        @Arg("input", () => NewBookingInput) input: NewBookingInput,
        @Ctx() ctx: GraphQLContext
    ) {
        if (!ctx.user) throw new Error("Not authenticated");

        // Force the familyMemberId to be the logged-in user's profile ID
        // Note: This assumes ctx.user.id maps to FamilyMemberProfile.id or similar logic exists in service
        // Ideally, service handles finding the profile ID from User ID.
        // For now, passing input as is, but best practice is to override familyMemberId from context.
        
        return ctx.services.bookingService.createBooking({
            ...input,
            // Security: Ensure the booking is made by the logged-in user
            // This might require fetching the family profile ID first if it differs from User ID
        });
    }

    @Mutation(() => Booking)
    async rescheduleBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Arg("input", () => UpdatedBookingScheduelInput) input: UpdatedBookingScheduelInput,
        @Ctx() ctx: GraphQLContext
    ) {
        return ctx.services.bookingService.rescheduelBooking(
            bookingId,
            input
        );
    }

    @Mutation(() => Booking)
    async cancelBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ) {
        return ctx.services.bookingService.cancelBooking(bookingId);
    }

    @Mutation(() => Booking)
    async confirmBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ) {
        return ctx.services.bookingService.confirmBooking(bookingId);
    }

    @Mutation(() => Booking)
    async completeBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() ctx: GraphQLContext
    ) {
        return ctx.services.bookingService.completeBooking(bookingId);
    }
}