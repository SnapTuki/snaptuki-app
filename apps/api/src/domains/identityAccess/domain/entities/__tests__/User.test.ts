// src/domains/identityAccess/domain/entities/__tests__/User.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { User, UserState } from '../user';
import { Email } from '../../valueObjects/email.vo';
import { Role, assertRole } from '../../valueObjects/role.vo';

// Mock the Value Objects and assertions to isolate the Entity tests
vi.mock('../../valueObjects/email.vo', () => {
  return {
    Email: {
      create: vi.fn((email: string) => ({
        toString: () => email,
        getValue: () => email,
      })),
    },
  };
});

vi.mock('../../valueObjects/role.vo', () => {
  return {
    assertRole: vi.fn((role: any) => {
      if (role !== 'COORDINATOR' && role !== 'CAREGIVER' && role !== 'ADMIN') {
        throw new Error('Invalid Role');
      }
    }),
  };
});

describe('User Entity', () => {
  const mockUserId = 'cuid-12345';
  const mockEmail = Email.create('staff@careagency.fi');
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Creation (createNew)', () => {
    it('should create a valid new user with default COORDINATOR role and active state', () => {
      const user = User.createNew({
        userId: mockUserId,
        email: mockEmail,
        passwordHash: 'hashed_password',
        firstName: 'Matti',
        lastName: 'Virtanen',
        agencyId: 101,
      });

      const snapshot = user.snapshot();

      expect(snapshot.userId).toBe(mockUserId);
      expect(snapshot.firstName).toBe('Matti');
      expect(snapshot.lastName).toBe('Virtanen');
      expect(snapshot.active).toBe(true);
      expect(snapshot.roles).toContain('COORDINATOR');
      expect(snapshot.agencyId).toBe(101);
      expect(snapshot.createdAt).toBeInstanceOf(Date);
      expect(snapshot.updatedAt).toEqual(snapshot.createdAt);
    });

    it('should throw an error if first name or last name is empty', () => {
      expect(() => {
        User.createNew({
          userId: mockUserId,
          email: mockEmail,
          passwordHash: 'hash',
          firstName: '   ', // Empty
          lastName: 'Virtanen',
        });
      }).toThrowError('First name and last name are required.');
    });
  });

  describe('Rehydration (restore)', () => {
    it('should perfectly restore a user from a snapshot state', () => {
      const pastDate = new Date('2025-01-01T12:00:00Z');
      const snapshotState: UserState = {
        userId: 'cuid-999',
        email: 'admin@careagency.fi',
        passwordHash: 'old_hash',
        firstName: 'Anna',
        lastName: 'Korhonen',
        roles: ['ADMIN' as Role],
        active: false,
        agencyId: null,
        createdAt: pastDate,
        updatedAt: pastDate,
      };

      const restoredUser = User.restore(snapshotState);
      const newSnapshot = restoredUser.snapshot();

      expect(newSnapshot).toEqual(snapshotState);
    });
  });

  describe('Domain Behaviors & State Mutations', () => {
    let user: User;

    beforeEach(() => {
      user = User.createNew({
        userId: mockUserId,
        email: mockEmail,
        passwordHash: 'hash123',
        firstName: 'Matti',
        lastName: 'Virtanen',
      });
    });

    it('should assign a new role and update the updatedAt timestamp', () => {
      const initialUpdatedAt = user.snapshot().updatedAt;
      
      // Simulate a small time delay
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      user.assignRole('CAREGIVER' as Role);
      const snapshot = user.snapshot();

      expect(snapshot.roles).toContain('COORDINATOR');
      expect(snapshot.roles).toContain('CAREGIVER');
      expect(snapshot.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
      
      vi.useRealTimers();
    });

    it('should deactivate and activate the user correctly', () => {
      expect(user.snapshot().active).toBe(true);

      user.deactivate();
      expect(user.snapshot().active).toBe(false);

      user.activate();
      expect(user.snapshot().active).toBe(true);
    });

    it('should update identity details', () => {
      user.updateIdentityDetails('Pekka', 'Mäkinen');
      const snapshot = user.snapshot();
      
      expect(snapshot.firstName).toBe('Pekka');
      expect(snapshot.lastName).toBe('Mäkinen');
    });

    it('should throw an error when updating identity with empty strings', () => {
      expect(() => {
        user.updateIdentityDetails('', 'Mäkinen');
      }).toThrowError('First name and last name cannot be empty.');
    });

    it('should update the password hash', () => {
      user.changePasswordHash('new_secure_hash');
      expect(user.snapshot().passwordHash).toBe('new_secure_hash');
    });

    it('should throw an error when changing password hash to empty', () => {
      expect(() => {
        user.changePasswordHash('   ');
      }).toThrowError('Password hash cannot be empty.');
    });

    it('should change account email using the Email factory', () => {
      user.changeAccountEmail('new.email@careagency.fi');
      expect(Email.create).toHaveBeenCalledWith('new.email@careagency.fi');
      expect(user.snapshot().email).toBe('new.email@careagency.fi');
    });
  });
});