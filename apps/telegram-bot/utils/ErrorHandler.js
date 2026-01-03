/**
 * Enhanced error handling utilities for the Telegram bot
 * Handles database connection errors, session timeouts, and assignment deletion scenarios
 */

// Import ApplicationStates from handlers (we'll need to adjust this import)
const ApplicationStates = {
  IDLE: 'idle',
  AWAITING_CONTACT: 'awaiting_contact',
  AWAITING_RATE: 'awaiting_rate',
  VERIFIED: 'verified',
  CREATING_ASSIGNMENT: 'creating_assignment',
  EDITING_BIO: 'editing_bio',
  EDITING_EXPERIENCE: 'editing_experience',
  EDITING_QUALIFICATIONS: 'editing_qualifications'
};

class ErrorHandler {
  /**
   * Handle database connection and operation errors
   * @param {Error} error - The database error
   * @param {Object} bot - Telegram bot instance
   * @param {string} chatId - Chat ID
   * @param {string} operation - Description of the operation that failed
   * @returns {string} Error type for handling logic
   */
  static async handleDatabaseError(error, bot, chatId, operation = 'database operation') {
    console.error(`Database error during ${operation}:`, error);
    
    // Check for specific MongoDB errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      await this.safeSend(bot, chatId, '❌ Database connection issue. Please try again in a moment.');
      return 'network_error';
    } else if (error.name === 'ValidationError') {
      await this.safeSend(bot, chatId, '❌ Invalid data format. Please check your input and try again.');
      return 'validation_error';
    } else if (error.name === 'CastError') {
      await this.safeSend(bot, chatId, '❌ Data format error. Please try again.');
      return 'cast_error';
    } else {
      await this.safeSend(bot, chatId, '❌ A database error occurred. Please try again later.');
      return 'unknown_error';
    }
  }

  /**
   * Handle session timeout scenarios
   * @param {Object} bot - Telegram bot instance
   * @param {string} chatId - Chat ID
   * @param {Object} userSessions - User sessions object
   */
  static async handleSessionTimeout(bot, chatId, userSessions) {
    console.warn(`Session timeout detected for chatId: ${chatId}`);
    
    // Clear any pending session data
    if (userSessions[chatId]) {
      delete userSessions[chatId].pendingRate;
      delete userSessions[chatId].pendingAssignmentId;
      userSessions[chatId].state = ApplicationStates.IDLE;
    }
    
    await this.safeSend(bot, chatId, 
      '⏰ Your session has expired. Please start the application process again.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 View Available Assignments', callback_data: 'view_assignments' }],
            [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
          ]
        }
      }
    );
  }

  /**
   * Handle assignment not found scenarios
   * @param {Object} bot - Telegram bot instance
   * @param {string} chatId - Chat ID
   * @param {Object} userSessions - User sessions object
   * @param {string} assignmentId - Assignment ID that was not found
   */
  static async handleAssignmentNotFound(bot, chatId, userSessions, assignmentId) {
    console.warn(`Assignment not found: ${assignmentId} for chatId: ${chatId}`);
    
    // Clear pending assignment data
    if (userSessions[chatId]) {
      delete userSessions[chatId].pendingAssignmentId;
      delete userSessions[chatId].pendingRate;
      userSessions[chatId].state = ApplicationStates.IDLE;
    }
    
    await this.safeSend(bot, chatId, 
      '❌ This assignment is no longer available. It may have been filled or removed.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 View Available Assignments', callback_data: 'view_assignments' }],
            [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
          ]
        }
      }
    );
  }

  /**
   * Handle tutor profile not found scenarios
   * @param {Object} bot - Telegram bot instance
   * @param {string} chatId - Chat ID
   * @param {Object} userSessions - User sessions object
   */
  static async handleTutorNotFound(bot, chatId, userSessions) {
    console.warn(`Tutor not found for chatId: ${chatId}`);
    
    // Clear session data
    if (userSessions[chatId]) {
      delete userSessions[chatId].tutorId;
      delete userSessions[chatId].pendingRate;
      delete userSessions[chatId].pendingAssignmentId;
      userSessions[chatId].state = ApplicationStates.IDLE;
    }
    
    await this.safeSend(bot, chatId, 
      '❌ Your profile was not found. Please complete your registration first.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Restart Registration', callback_data: 'restart_registration' }],
            [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
          ]
        }
      }
    );
  }

  /**
   * Validate if a session is still valid (not expired)
   * @param {Object} session - User session object
   * @returns {boolean} True if session is valid
   */
  static isSessionValid(session) {
    if (!session) return false;
    
    // Check if session has required fields
    if (!session.tutorId) return false;
    
    // Check if session is too old (30 minutes timeout)
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    const now = Date.now();
    const sessionAge = now - (session.lastActivity || session.createdAt || now);
    
    return sessionAge < SESSION_TIMEOUT;
  }

  /**
   * Update session activity timestamp
   * @param {Object} session - User session object
   */
  static updateSessionActivity(session) {
    if (session) {
      session.lastActivity = Date.now();
    }
  }

  /**
   * Safe send function with error handling
   * @param {Object} bot - Telegram bot instance
   * @param {string} chatId - Chat ID
   * @param {string} text - Message text
   * @param {Object} options - Message options
   */
  static async safeSend(bot, chatId, text, options = {}) {
    try {
      const messageText = String(text);
      console.log(`📤 Sending to ${chatId}:`, messageText.substring(0, 80));
      
      return await bot.sendMessage(chatId, messageText, options);
    } catch (error) {
      console.error(`❌ Failed to send message to ${chatId}:`, error.message);
      throw error;
    }
  }

  /**
   * Handle application submission errors with retry logic
   * @param {Object} bot - Telegram bot instance
   * @param {string} chatId - Chat ID
   * @param {Object} userSessions - User sessions object
   * @param {Object} Assignment - Assignment model
   * @param {string} assignmentId - Assignment ID
   * @param {Object} applicationData - Application data to submit
   * @param {number} retryCount - Current retry count
   * @returns {boolean} True if successful, false otherwise
   */
  static async handleApplicationSubmissionWithRetry(bot, chatId, userSessions, Assignment, assignmentId, applicationData, retryCount = 0) {
    const MAX_RETRIES = 2;
    
    try {
      // Attempt to find and update the assignment
      const assignment = await Assignment.findById(assignmentId);
      
      if (!assignment) {
        await this.handleAssignmentNotFound(bot, chatId, userSessions, assignmentId);
        return false;
      }

      if (assignment.status !== 'Open') {
        await this.safeSend(bot, chatId, '❌ This assignment is no longer accepting applications.');
        return false;
      }

      // Check if user already applied
      const existingApplication = assignment.applicants.find(app => 
        app.tutorId.toString() === applicationData.tutorId.toString()
      );
      
      if (existingApplication) {
        await this.safeSend(bot, chatId, '⚠️ You have already applied for this assignment.');
        return false;
      }

      // Add the application
      assignment.applicants.push(applicationData);
      await assignment.save();
      
      return true;
      
    } catch (error) {
      console.error(`Application submission error (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES) {
        // Retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return await this.handleApplicationSubmissionWithRetry(
          bot, chatId, userSessions, Assignment, assignmentId, applicationData, retryCount + 1
        );
      } else {
        // Max retries reached, handle the error
        const errorType = await this.handleDatabaseError(error, bot, chatId, 'application submission');
        return false;
      }
    }
  }
}

export default ErrorHandler;