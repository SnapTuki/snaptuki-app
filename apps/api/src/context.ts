import { AuthService } from "./domains/auth/auth.service"
import { BookingService } from "./domains/booking/booking.service"
import { FamilyProfileService } from "./domains/family-profile/family-profile.service"
import { ElderProfileService } from "./domains/elder-profile/elder-profile.service"
import { CareTaskBookService } from "./domains/care-task-book/ctb.service"
import { CareServiceService } from "./domains/care-service/care-service.service"
import { User } from "./domains/auth/auth.types"
import { CaregiverProfileService } from "./domains/caregiver-profile/cg.service"

export interface GraphQLContext {
    services: {
        authService: AuthService,
        bookingService: BookingService,
        familyProfileService: FamilyProfileService,
        elderProfileService: ElderProfileService,
        careTaskBookService: CareTaskBookService,
        careServiceService: CareServiceService,
        caregiverProfileService: CaregiverProfileService
    },
    user: User | null
}

