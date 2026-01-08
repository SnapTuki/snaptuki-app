import { AuthService } from "./domains/auth/auth.service"
import { BookingService } from "./domains/booking/booking.service"
import { FamilyProfileService } from "./domains/family-profile/family-profile.service"
import { User } from "./domains/auth/auth.types"

export interface GraphQLContext {
    services: {
        authService: AuthService,
        bookingService: BookingService,
        familyProfileService: FamilyProfileService,
    },
    user: User | null
}

