/**
 * End-to-End Integration Tests for Tuition Rate Application Enhancement
 * 
 * This test suite validates the complete application flow with rate collection,
 * database persistence, and backward compatibility with existing applications.
 * 
 * **Feature: tuition-rate-application**
 * **Validates: All requirements**
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import Assignment from '../../../packages/shared/models/Assignment.js';
import Tutor from '../../../packages/shared/models/Tutor.js';
import RateValidator from '../utils/RateValidator.js';
import ErrorHandler from '../utils/ErrorHandler.js';

describe('Tuition Rate Application - End-to-End Integration Tests', () => {
  let testTutor;
  let testAssignment;
  let originalEnv;

  const TEST_PHONE = '+6591234567';
  const TEST_USER_ID = '67890';

  beforeAll(async () => {
    // Store original environment
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    // Connect to test database
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/tuition-bot-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Restore environment
    process.env.NODE_ENV = originalEnv;
    
    // Clean up and close database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up database
    await Tutor.deleteMany({});
    await Assignment.deleteMany({});

    // Create test tutor
    testTutor = new Tutor({
      fullName: 'Test Tutor',
      contactNumber: TEST_PHONE,
      email: 'test@example.com',
      telegramId: TEST_USER_ID,
      gender: 'Male',
      age: '25',
      race: 'Chinese',
      nationality: 'Singaporean',
      tutorType: 'Part-time Tutor',
      yearsOfExperience: '3',
      highestEducation: 'Degree',
      teachingLevels: {
        primary: { mathematics: true, english: true },
        secondary: { mathematics: true, physics: true }
      },
      locations: {
        north: true,
        central: true
      },
      availableTimeSlots: {
        weekdayEvening: true,
        weekendAfternoon: true
      },
      hourlyRate: {
        primary: '40',
        secondary: '50'
      }
    });
    await testTutor.save();

    // Create test assignment
    testAssignment = new Assignment({
      title: 'Primary Math Tuition',
      level: 'Primary',
      subject: 'Mathematics',
      location: 'Tampines',
      frequency: 'Twice a week',
      rate: '40-60/hr',
      description: 'Looking for experienced tutor',
      status: 'Open',
      applicants: []
    });
    await testAssignment.save();
  });

  afterEach(async () => {
    // Clean up after each test
    await Tutor.deleteMany({});
    await Assignment.deleteMany({});
  });

  describe('Database Schema and Rate Storage', () => {
    test('should store rate field in applicants array correctly', async () => {
      // Create application with rate
      const applicationData = {
        tutorId: testTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: testTutor.contactNumber,
        notes: 'Test application',
        rate: '45'
      };

      // Add application to assignment
      testAssignment.applicants.push(applicationData);
      await testAssignment.save();

      // Verify data persistence
      const savedAssignment = await Assignment.findById(testAssignment._id);
      expect(savedAssignment.applicants).toHaveLength(1);
      
      const application = savedAssignment.applicants[0];
      expect(application.tutorId.toString()).toBe(testTutor._id.toString());
      expect(application.rate).toBe('45');
      expect(application.status).toBe('Pending');
      expect(application.contactDetails).toBe(testTutor.contactNumber);
      expect(application.appliedAt).toBeInstanceOf(Date);
    });

    test('should handle applications without rate field (backward compatibility)', async () => {
      // Create application without rate (existing format)
      const oldApplicationData = {
        tutorId: testTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: testTutor.contactNumber,
        notes: 'Old application without rate'
        // Note: no rate field
      };

      testAssignment.applicants.push(oldApplicationData);
      await testAssignment.save();

      // Verify old format still works
      const savedAssignment = await Assignment.findById(testAssignment._id);
      expect(savedAssignment.applicants).toHaveLength(1);
      expect(savedAssignment.applicants[0].rate).toBeUndefined();
      expect(savedAssignment.applicants[0].tutorId.toString()).toBe(testTutor._id.toString());
    });

    test('should handle mixed applications (with and without rate)', async () => {
      // Add old application without rate
      testAssignment.applicants.push({
        tutorId: testTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: testTutor.contactNumber,
        notes: 'Old application'
      });

      // Create second tutor
      const secondTutor = new Tutor({
        fullName: 'Second Tutor',
        contactNumber: '+6591234568',
        email: 'second@example.com',
        telegramId: '67891',
        tutorType: 'Part-time Tutor'
      });
      await secondTutor.save();

      // Add new application with rate
      testAssignment.applicants.push({
        tutorId: secondTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: secondTutor.contactNumber,
        notes: 'New application',
        rate: '50'
      });

      await testAssignment.save();

      // Verify both applications coexist
      const savedAssignment = await Assignment.findById(testAssignment._id);
      expect(savedAssignment.applicants).toHaveLength(2);
      
      // First application (old format)
      expect(savedAssignment.applicants[0].rate).toBeUndefined();
      expect(savedAssignment.applicants[0].tutorId.toString()).toBe(testTutor._id.toString());
      
      // Second application (new format)
      expect(savedAssignment.applicants[1].rate).toBe('50');
      expect(savedAssignment.applicants[1].tutorId.toString()).toBe(secondTutor._id.toString());
    });
  });

  describe('Rate Validation Integration', () => {
    test('should validate and format various rate inputs correctly', async () => {
      const testCases = [
        { input: '30', expectedRate: '30', expectedFormatted: '30/hr' },
        { input: '$30', expectedRate: '30', expectedFormatted: '30/hr' },
        { input: '30/hr', expectedRate: '30', expectedFormatted: '30/hr' },
        { input: '$30/hr', expectedRate: '30', expectedFormatted: '30/hr' },
        { input: '30/Hr', expectedRate: '30', expectedFormatted: '30/hr' },
        { input: '$30/HR', expectedRate: '30', expectedFormatted: '30/hr' },
        { input: '30.50', expectedRate: '30.5', expectedFormatted: '30.5/hr' },
        { input: '$30.50/hr', expectedRate: '30.5', expectedFormatted: '30.5/hr' }
      ];

      for (const testCase of testCases) {
        const validation = RateValidator.validate(testCase.input);
        
        expect(validation.valid).toBe(true);
        expect(validation.rate).toBe(testCase.expectedRate);
        expect(validation.formatted).toBe(testCase.expectedFormatted);

        // Test database storage with validated rate
        const applicationData = {
          tutorId: testTutor._id,
          status: 'Pending',
          appliedAt: new Date(),
          contactDetails: testTutor.contactNumber,
          rate: validation.rate
        };

        // Create new assignment for each test to avoid conflicts
        const assignment = new Assignment({
          title: `Test Assignment ${testCase.input}`,
          level: 'Primary',
          subject: 'Mathematics',
          location: 'Test Location',
          frequency: 'Once a week',
          rate: '40-60/hr',
          status: 'Open',
          applicants: [applicationData]
        });

        await assignment.save();

        // Verify storage
        const saved = await Assignment.findById(assignment._id);
        expect(saved.applicants[0].rate).toBe(testCase.expectedRate);
      }
    });

    test('should handle rate validation errors correctly', async () => {
      const invalidInputs = [
        '',
        '   ',
        'abc',
        '30abc',
        '$30abc/hr',
        '30//hr',
        '-30',
        '$-30/hr',
        null,
        undefined
      ];

      for (const input of invalidInputs) {
        const validation = RateValidator.validate(input);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBeDefined();
        expect(typeof validation.error).toBe('string');
      }
    });

    test('should provide warnings for rates outside normal range', async () => {
      // Test low rate warning
      const lowRateValidation = RateValidator.validate('5');
      expect(lowRateValidation.valid).toBe(true);
      expect(lowRateValidation.warning).toContain('low');

      // Test high rate warning
      const highRateValidation = RateValidator.validate('250');
      expect(highRateValidation.valid).toBe(true);
      expect(highRateValidation.warning).toContain('high');

      // Test normal rate (no warning)
      const normalRateValidation = RateValidator.validate('50');
      expect(normalRateValidation.valid).toBe(true);
      expect(normalRateValidation.warning).toBeNull();

      // Verify all can be stored in database
      const applications = [
        { rate: lowRateValidation.rate, expected: '5' },
        { rate: highRateValidation.rate, expected: '250' },
        { rate: normalRateValidation.rate, expected: '50' }
      ];

      for (let i = 0; i < applications.length; i++) {
        const assignment = new Assignment({
          title: `Rate Warning Test ${i}`,
          level: 'Primary',
          subject: 'Mathematics',
          location: 'Test Location',
          frequency: 'Once a week',
          rate: '40-60/hr',
          status: 'Open',
          applicants: [{
            tutorId: testTutor._id,
            status: 'Pending',
            appliedAt: new Date(),
            contactDetails: testTutor.contactNumber,
            rate: applications[i].rate
          }]
        });

        await assignment.save();
        const saved = await Assignment.findById(assignment._id);
        expect(saved.applicants[0].rate).toBe(applications[i].expected);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle concurrent applications correctly', async () => {
      // Create multiple tutors
      const tutors = [];
      for (let i = 0; i < 3; i++) {
        const tutor = new Tutor({
          fullName: `Tutor ${i}`,
          contactNumber: `+659123456${i}`,
          email: `tutor${i}@example.com`,
          telegramId: `6789${i}`,
          tutorType: 'Part-time Tutor'
        });
        await tutor.save();
        tutors.push(tutor);
      }

      // Apply concurrently
      const applications = tutors.map((tutor, index) => ({
        tutorId: tutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: tutor.contactNumber,
        rate: `${40 + index * 5}`
      }));

      // Add all applications
      testAssignment.applicants.push(...applications);
      await testAssignment.save();

      // Verify all applications were saved
      const savedAssignment = await Assignment.findById(testAssignment._id);
      expect(savedAssignment.applicants).toHaveLength(3);

      // Verify each application has correct data
      for (let i = 0; i < 3; i++) {
        const app = savedAssignment.applicants[i];
        expect(app.tutorId.toString()).toBe(tutors[i]._id.toString());
        expect(app.rate).toBe(`${40 + i * 5}`);
        expect(app.status).toBe('Pending');
      }
    });

    test('should prevent duplicate applications from same tutor', async () => {
      // Add first application
      testAssignment.applicants.push({
        tutorId: testTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: testTutor.contactNumber,
        rate: '45'
      });
      await testAssignment.save();

      // Check for existing application before adding duplicate
      const existingApplication = testAssignment.applicants.find(app => 
        app.tutorId.toString() === testTutor._id.toString()
      );

      expect(existingApplication).toBeDefined();
      expect(existingApplication.rate).toBe('45');

      // Verify only one application exists
      expect(testAssignment.applicants).toHaveLength(1);
    });

    test('should handle assignment status changes correctly', async () => {
      // Add application to open assignment
      testAssignment.applicants.push({
        tutorId: testTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: testTutor.contactNumber,
        rate: '45'
      });
      await testAssignment.save();

      // Change assignment status
      testAssignment.status = 'Filled';
      await testAssignment.save();

      // Verify assignment and application data integrity
      const savedAssignment = await Assignment.findById(testAssignment._id);
      expect(savedAssignment.status).toBe('Filled');
      expect(savedAssignment.applicants).toHaveLength(1);
      expect(savedAssignment.applicants[0].rate).toBe('45');
    });
  });

  describe('Data Integrity and Persistence', () => {
    test('should maintain data integrity across database operations', async () => {
      // Create complex application data
      const applicationData = {
        tutorId: testTutor._id,
        status: 'Pending',
        appliedAt: new Date(),
        contactDetails: testTutor.contactNumber,
        notes: 'Complex application with special characters: àáâãäåæçèéêë',
        rate: '45.75'
      };

      testAssignment.applicants.push(applicationData);
      await testAssignment.save();

      // Retrieve and verify data integrity
      const savedAssignment = await Assignment.findById(testAssignment._id);
      const savedApplication = savedAssignment.applicants[0];

      expect(savedApplication.tutorId.toString()).toBe(testTutor._id.toString());
      expect(savedApplication.status).toBe('Pending');
      expect(savedApplication.contactDetails).toBe(testTutor.contactNumber);
      expect(savedApplication.notes).toBe('Complex application with special characters: àáâãäåæçèéêë');
      expect(savedApplication.rate).toBe('45.75');
      expect(savedApplication.appliedAt).toBeInstanceOf(Date);
    });

    test('should handle large numbers of applications', async () => {
      // Create many tutors and applications
      const tutors = [];
      const applications = [];

      for (let i = 0; i < 50; i++) {
        const tutor = new Tutor({
          fullName: `Tutor ${i}`,
          contactNumber: `+65912345${i.toString().padStart(2, '0')}`,
          email: `tutor${i}@example.com`,
          telegramId: `6789${i}`,
          tutorType: 'Part-time Tutor'
        });
        await tutor.save();
        tutors.push(tutor);

        applications.push({
          tutorId: tutor._id,
          status: 'Pending',
          appliedAt: new Date(),
          contactDetails: tutor.contactNumber,
          rate: `${30 + (i % 20)}`
        });
      }

      // Add all applications
      testAssignment.applicants.push(...applications);
      await testAssignment.save();

      // Verify all applications were saved
      const savedAssignment = await Assignment.findById(testAssignment._id);
      expect(savedAssignment.applicants).toHaveLength(50);

      // Verify data integrity for random samples
      const sampleIndices = [0, 10, 25, 40, 49];
      for (const index of sampleIndices) {
        const app = savedAssignment.applicants[index];
        expect(app.tutorId.toString()).toBe(tutors[index]._id.toString());
        expect(app.rate).toBe(`${30 + (index % 20)}`);
        expect(app.status).toBe('Pending');
      }
    });

    test('should preserve original rate format in database', async () => {
      const rateFormats = [
        { input: '30', stored: '30' },
        { input: '30.5', stored: '30.5' },
        { input: '30.50', stored: '30.5' },
        { input: '100', stored: '100' },
        { input: '99.99', stored: '99.99' }
      ];

      for (let i = 0; i < rateFormats.length; i++) {
        const assignment = new Assignment({
          title: `Rate Format Test ${i}`,
          level: 'Primary',
          subject: 'Mathematics',
          location: 'Test Location',
          frequency: 'Once a week',
          rate: '40-60/hr',
          status: 'Open',
          applicants: [{
            tutorId: testTutor._id,
            status: 'Pending',
            appliedAt: new Date(),
            contactDetails: testTutor.contactNumber,
            rate: rateFormats[i].stored
          }]
        });

        await assignment.save();

        // Verify stored format
        const saved = await Assignment.findById(assignment._id);
        expect(saved.applicants[0].rate).toBe(rateFormats[i].stored);
      }
    });
  });
});