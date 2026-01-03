'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertCircle, Info, Loader2, ArrowRight, DollarSign } from 'lucide-react';
import RateValidator from '../utils/RateValidator.js';

const RateInputModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedAssignments, 
  tutorData,
  isSubmitting = false 
}) => {
  const [rates, setRates] = useState({});
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [globalError, setGlobalError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRates({});
      setErrors({});
      setWarnings({});
      setGlobalError('');
    }
  }, [isOpen]);

  const handleRateChange = (assignmentId, value) => {
    setRates(prev => ({ ...prev, [assignmentId]: value }));
    
    // Clear previous error/warning for this assignment
    setErrors(prev => ({ ...prev, [assignmentId]: '' }));
    setWarnings(prev => ({ ...prev, [assignmentId]: '' }));
    setGlobalError('');

    // Validate if there's a value
    if (value.trim()) {
      const validation = RateValidator.validate(value);
      
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, [assignmentId]: validation.error }));
      } else if (validation.warning) {
        setWarnings(prev => ({ ...prev, [assignmentId]: validation.warning }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all rates
    const validatedRates = {};
    let hasErrors = false;
    const newErrors = {};
    const newWarnings = {};

    for (const assignment of selectedAssignments) {
      const rateInput = rates[assignment._id];
      
      if (!rateInput || !rateInput.trim()) {
        newErrors[assignment._id] = 'Rate is required';
        hasErrors = true;
        continue;
      }

      const validation = RateValidator.validate(rateInput);
      
      if (!validation.valid) {
        newErrors[assignment._id] = validation.error;
        hasErrors = true;
      } else {
        validatedRates[assignment._id] = validation.rate;
        if (validation.warning) {
          newWarnings[assignment._id] = validation.warning;
        }
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    if (hasErrors) {
      setGlobalError('Please fix the errors above before submitting.');
      return;
    }

    try {
      await onSubmit(validatedRates);
    } catch (error) {
      setGlobalError(error.message || 'An error occurred while submitting your application.');
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rate-modal-title"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-white to-slate-50 p-6 rounded-t-2xl border-b border-slate-100">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100" 
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-200 shadow-sm">
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 id="rate-modal-title" className="text-2xl font-bold tracking-tight text-slate-800">
                  Set Your Rates
                </h2>
                <p className="text-slate-600 mt-2">
                  Please specify your hourly rate for each assignment
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 flex-grow bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-sm">
                  <div className="flex items-start">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Info className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-blue-800">
                      <p className="font-medium mb-2">Rate Guidelines:</p>
                      <ul className="text-xs space-y-1 text-blue-700">
                        <li>• Enter formats like: 30, $30, 30/hr, or $30/hr</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Assignment Rate Inputs */}
                <div className="space-y-4">
                  {selectedAssignments.map((assignment) => (
                    <div key={assignment._id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Assignment Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 text-sm mb-1">
                            {assignment.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
                              {assignment.level}
                            </span>
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md">
                              {assignment.subject}
                            </span>
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-md">
                              📍 {assignment.location}
                            </span>
                          </div>
                          {assignment.rate && assignment.rate !== 'Tutor to propose' && (
                            <p className="text-xs text-slate-500 mt-1">
                              Suggested rate: {assignment.rate}
                            </p>
                          )}
                        </div>

                        {/* Rate Input */}
                        <div className="sm:w-32">
                          <label htmlFor={`rate-${assignment._id}`} className="sr-only">
                            Rate for {assignment.title}
                          </label>
                          <div className="relative">
                            <input
                              id={`rate-${assignment._id}`}
                              type="text"
                              value={rates[assignment._id] || ''}
                              onChange={(e) => handleRateChange(assignment._id, e.target.value)}
                              placeholder="e.g. 45"
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${
                                errors[assignment._id] 
                                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                  : warnings[assignment._id]
                                  ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                                  : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                              }`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-slate-400 text-sm">/hr</span>
                            </div>
                          </div>
                          
                          {/* Error Message */}
                          {errors[assignment._id] && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center mr-1 flex-shrink-0">
                                <AlertCircle className="h-2 w-2 text-white" />
                              </div>
                              {errors[assignment._id]}
                            </p>
                          )}
                          
                          {/* Warning Message */}
                          {warnings[assignment._id] && !errors[assignment._id] && (
                            <p className="mt-1 text-xs text-amber-600 flex items-center">
                              <div className="w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center mr-1 flex-shrink-0">
                                <AlertCircle className="h-2 w-2 text-white" />
                              </div>
                              {warnings[assignment._id]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Global Error */}
                {globalError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center text-sm" role="alert">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <AlertCircle className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-red-700 font-medium">{globalError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-0.5 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-md"
                >
                  {isSubmitting && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
                  {isSubmitting ? 'Submitting Applications...' : (
                    <>
                      Submit Applications ({selectedAssignments.length})
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RateInputModal;