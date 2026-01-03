/**
 * RateValidator utility class for validating tuition rate inputs
 * Handles case-insensitive input formats and provides range warnings
 */
class RateValidator {
  /**
   * Validates rate input and returns validation result with formatted output
   * @param {string} input - The rate input string to validate
   * @returns {Object} Validation result object
   */
  static validate(input) {
    // Handle null, undefined, or non-string inputs
    if (!input || typeof input !== 'string') {
      return { 
        valid: false, 
        error: "Invalid format. Please enter like: 30, $30, 30/hr, or $30/hr" 
      };
    }

    // Remove whitespace and convert to lowercase for case-insensitive matching
    const cleaned = input.trim().toLowerCase();
    
    // Handle empty input after trimming
    if (!cleaned) {
      return { 
        valid: false, 
        error: "Please enter a valid rate" 
      };
    }
    
    // Extract numeric value using case-insensitive regex
    // Matches: 30, $30, 30/hr, $30/hr, 30/Hr, $30/HR, etc.
    const match = cleaned.match(/^\$?(\d+(?:\.\d{1,2})?)(?:\/hr)?$/i);
    
    if (!match) {
      return { 
        valid: false, 
        error: "Invalid format. Please enter like: 30, $30, 30/hr, or $30/hr" 
      };
    }
    
    const rate = parseFloat(match[1]);
    
    // Check for invalid numbers (NaN, Infinity, etc.)
    if (!isFinite(rate) || rate <= 0) {
      return { 
        valid: false, 
        error: "Please enter a valid positive number" 
      };
    }
    
    // Range validation with warnings
    let warning = null;
    if (rate < 10) {
      warning = "Rate seems low. Are you sure?";
    } else if (rate > 200) {
      warning = "Rate seems high. Are you sure?";
    }
    
    return { 
      valid: true, 
      rate: rate.toString(), 
      formatted: `$${rate}/hr`,
      warning 
    };
  }
}

export default RateValidator;