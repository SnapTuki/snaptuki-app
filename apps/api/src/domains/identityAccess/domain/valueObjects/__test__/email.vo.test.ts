// src/domains/identityAccess/domain/valueObjects/__tests__/email.vo.test.ts
import { describe, it, expect } from 'vitest';
import { Email } from '../email.vo'; // Adjust the import path as needed

describe('Email Value Object', () => {
  
  describe('create()', () => {
    it('should create an Email instance with a perfectly formatted address', () => {
      const email = Email.create('caregiver@snaptuki.fi');
      
      expect(email).toBeInstanceOf(Email);
      expect(email.toString()).toBe('caregiver@snaptuki.fi');
    });

    it('should normalize the input by trimming whitespace and converting to lowercase', () => {
      const email = Email.create('  Admin@SnapTuki.FI  ');
      
      expect(email.toString()).toBe('admin@snaptuki.fi');
    });

    it('should throw an error for invalid email formats', () => {
      const invalidEmails = [
        'plainaddress',
        '@no-local-part.fi',
        'no-at-sign.fi',
        'no-domain@.fi',
        'missing-dot@domain',
        'spaces in@domain.fi'
      ];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow('Invalid email format');
      });
    });

    it('should throw an error if an empty string or string with only spaces is provided', () => {
      expect(() => Email.create('')).toThrow('Invalid email format');
      expect(() => Email.create('   ')).toThrow('Invalid email format');
    });
  });

  describe('toString()', () => {
    it('should accurately return the string value of the email', () => {
      const email = Email.create('staff@snaptuki.fi');
      
      expect(email.toString()).toBe('staff@snaptuki.fi');
    });
  });

  describe('equals()', () => {
    it('should return true when comparing two functionally identical email objects', () => {
      const email1 = Email.create('manager@snaptuki.fi');
      // Even if instantiated with different casing, the normalization makes them equal
      const email2 = Email.create('MANAGER@snaptuki.fi'); 

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false when comparing two different email objects', () => {
      const email1 = Email.create('staff1@snaptuki.fi');
      const email2 = Email.create('staff2@snaptuki.fi');

      expect(email1.equals(email2)).toBe(false);
    });
  });
});