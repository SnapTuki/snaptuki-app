classDiagram
    direction TB

    %% ======================
    %% Aggregate Root
    %% ======================
    class User {
        +UserId id
        +Email email
        +PasswordHash passwordHash
        +Role role
        +UserStatus status
        -----------------------
        +activate()
        +deactivate()
        +canLogin()
        +changeRole()
    }

    %% ======================
    %% Entities inside Aggregate
    %% ======================
    class CaregiverProfile {
        +ProfileId id
        +employmentStatus
        +certifications
    }

    class StaffProfile {
        +ProfileId id
        +position
        +permissionsScope
    }

    %% ======================
    %% Value Objects
    %% ======================
    class Email {
        <<ValueObject>>
        +value
    }

    class PasswordHash {
        <<ValueObject>>
        +value
    }

    class Role {
        <<ValueObject>>
        +value
        +isAdmin()
        +isCaregiver()
    }

    class UserStatus {
        <<ValueObject>>
        +ACTIVE
        +INACTIVE
        +SUSPENDED
    }

    %% ======================
    %% Domain Services
    %% ======================
    class CredentialVerificationService {
        <<DomainService>>
        +verify()
    }

    class AuthorizationPolicyService {
        <<DomainService>>
        +canPerform()
    }

    %% ======================
    %% Repository
    %% ======================
    class UserRepository {
        <<Repository>>
        +findById()
        +findByEmail()
        +save()
    }

    %% ======================
    %% Relationships
    %% ======================
    User "1" *-- "0..1" CaregiverProfile
    User "1" *-- "0..1" StaffProfile

    User --> Email
    User --> PasswordHash
    User --> Role
    User --> UserStatus

    User --> CredentialVerificationService
    AuthorizationPolicyService --> Role
    UserRepository --> User
