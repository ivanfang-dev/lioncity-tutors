'use client';

import {
  useState,
  useEffect,
  useMemo,
  memo,
  useCallback,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';

// Import from shared package
import {
  EDUCATION_LEVELS,
  SUBJECTS,
  LEVEL_SUBJECT_MAPPINGS
} from '@lioncity/shared/client-exports.js';

// --- Custom Hooks ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// --- Premium Icons (using Lucide-React for consistency) ---
import {
  MapPin,
  Calendar,
  Search,
  Book,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';


// --- Verification Modal Component ---
const VerificationModal = ({ isOpen, onClose, onSubmit, selectedAssignments }) => {
  const [identifier, setIdentifier] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [appliedAssignments, setAppliedAssignments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIdentifier('');
      setIsVerifying(false);
      setError('');
      setIsSuccess(false);
      setAppliedAssignments([]);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide your contact number or email address.');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      const result = await onSubmit(identifier);
      if (result === 'redirect') {
        onClose();
      } else if (Array.isArray(result)) {
        setAppliedAssignments(result);
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
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
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-t-2xl">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
              <div className="text-center">
                {isSuccess ? (
                  <>
                    <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-500">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h2 id="modal-title" className="text-2xl font-bold tracking-tight">Application Sent!</h2>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-slate-500">
                      <ArrowRight className="h-8 w-8 text-slate-400" />
                    </div>
                    <h2 id="modal-title" className="text-2xl font-bold tracking-tight">Final Step: Verify & Apply</h2>
                  </>
                )}
              </div>
            </div>
            <div className="px-8 py-6 flex-grow">
              {isSuccess ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <p className="text-emerald-800 font-medium">You've successfully applied for {appliedAssignments.length} assignment{appliedAssignments.length !== 1 ? 's' : ''}.</p>
                    <p className="text-emerald-700 text-sm mt-1">We will notify you via WhatsApp or email shortly.</p>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                     {appliedAssignments.map((assignment) => (
                      <div key={assignment._id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="text-center">
                          <h4 className="font-semibold text-slate-800 text-base">{assignment.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{assignment.level} • {assignment.subject}</p>
                        </div>
                      </div>
                     ))}
                   </div>
                   <div className="pt-4 border-t border-slate-200">
                     <button onClick={onClose} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-0.5">
                       Continue Browsing
                     </button>
                   </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>You are applying for <span className="font-bold">{selectedAssignments.length}</span> assignment{selectedAssignments.length !== 1 ? 's' : ''}. We require a quick verification of your tutor profile.</div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 mb-2">Registered Contact Number or Email</label>
                    <input id="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="e.g., 81234567 or tutor@email.com" className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"/>
                  </div>
                  {error && (<div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center text-sm" role="alert"><AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" /><p className="text-red-700 font-medium">{error}</p></div>)}
                  <button type="submit" disabled={isVerifying} className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-0.5 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center">
                    {isVerifying && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
                    {isVerifying ? 'Verifying Profile...' : `Verify & Submit Application (${selectedAssignments.length})`}
                  </button>
                  <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200">Don't have a tutor profile yet? <a href="/register-tutor" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline ml-1">Register Now</a></div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


// --- Assignment Card Component ---
const AssignmentCard = memo(({ assignment, isSelected, isExpanded, onSelect, onToggleExpand }) => {
    const isNew = new Date() - new Date(assignment.createdAt) < 7 * 24 * 60 * 60 * 1000;
    const hasLongDescription = assignment.description && assignment.description.length > 150;

    return (
        <article
          role="listitem"
          data-assignment-id={assignment._id}
          className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden mb-6 hover:shadow-xl hover:shadow-slate-200/50 ${
            isSelected
              ? 'border-teal-500 ring-2 ring-teal-200 shadow-lg shadow-teal-100/50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => onSelect(assignment._id)}
        >
          {/* Selection indicator */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
            isSelected ? 'bg-gradient-to-b from-teal-500 to-emerald-500' : 'bg-transparent'
          }`} />
          
          <div className="p-4 sm:p-6">
            {/* Mobile-first header layout */}
            <div className="flex items-start gap-3 mb-4">
              {/* Checkbox */}
              <div className="relative mt-1 flex-shrink-0">
                <input type="checkbox" className="sr-only" checked={isSelected} readOnly />
                <div className={`h-5 w-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                  isSelected 
                    ? 'bg-teal-600 border-teal-600 scale-110' 
                    : 'border-slate-300 group-hover:border-teal-400'
                }`}>
                  {isSelected && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Title and content - mobile stacked layout */}
              <div className="flex-1 min-w-0">
                {/* Title row with NEW badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight flex-1 min-w-0">
                    {assignment.title}
                  </h3>
                  {isNew && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                      NEW
                    </span>
                  )}
                </div>

                {/* Rate row - smaller and less prominent */}
                <div className="mb-3">
                  <div className="text-sm sm:text-base font-semibold text-emerald-600">
                    {assignment.rate && assignment.rate !== 'Tutor to propose' ? `${assignment.rate}` : 'Negotiate'}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    #{assignment._id.slice(-6)}
                  </span>
                </div>
                
                {/* Level and subject badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {assignment.level}
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    {assignment.subject}
                  </span>
                </div>

                {/* Location and frequency - mobile stacked, desktop grid */}
                <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="truncate">{assignment.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="truncate">{assignment.frequency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {assignment.description && (
              <div className="border-t border-slate-100 pt-3 sm:pt-4">
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? 'auto' : hasLongDescription ? '60px' : 'auto'
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {assignment.description}
                    </p>
                  </motion.div>
                  
                  {/* Subtle fade only for long descriptions when collapsed */}
                  {hasLongDescription && !isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>
                
                {/* Show more/less button */}
                {hasLongDescription && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(assignment._id);
                    }}
                    className="mt-2 sm:mt-3 text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1 transition-colors duration-200"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </article>
    );
});
AssignmentCard.displayName = 'AssignmentCard';

// --- Pagination Controls Component ---
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    // Logic to create page numbers with ellipsis
    const createPagination = () => {
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 3) {
                pageNumbers.push('...');
            }
            if (currentPage > 2) {
                pageNumbers.push(currentPage - 1);
            }
            if (currentPage !== 1 && currentPage !== totalPages) {
                pageNumbers.push(currentPage);
            }
            if (currentPage < totalPages - 1) {
                pageNumbers.push(currentPage + 1);
            }
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }
        return [...new Set(pageNumbers)]; // Remove duplicates
    };

    return (
      <nav className="flex items-center justify-between mt-8" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <div className="hidden sm:flex items-center gap-2">
            {createPagination().map((page, index) =>
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-lg transition ${
                            currentPage === page
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-2 text-slate-500">...</span>
                )
            )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    );
  };


// --- Main Client Component ---
export default function TuitionAssignmentsClient({ initialAssignments }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State Management ---
  const [allAssignments, setAllAssignments] = useState(initialAssignments || []);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [expandedAssignments, setExpandedAssignments] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ASSIGNMENTS_PER_PAGE = 12;

  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

  // --- Handle URL parameters for direct assignment selection ---
  useEffect(() => {
    // Fallback approach that works in all environments
    let applyAssignmentId = null;
    
    try {
      // Try Next.js approach first
      applyAssignmentId = searchParams.get('apply');
    } catch (error) {
      // Fallback to vanilla JS approach
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        applyAssignmentId = urlParams.get('apply');
      }
    }
    
    console.log('URL parameter check:', { applyAssignmentId, assignmentsCount: allAssignments.length });
    
    if (applyAssignmentId && allAssignments.length > 0) {
      // Check if the assignment exists
      const assignmentExists = allAssignments.some(a => a._id === applyAssignmentId);
      console.log('Assignment exists:', assignmentExists);
      
      if (assignmentExists) {
        console.log('Selecting assignment:', applyAssignmentId);
        // Select the assignment
        setSelectedAssignments([applyAssignmentId]);
        
        // Scroll to the assignment after a delay to ensure rendering
        setTimeout(() => {
          const assignmentElement = document.querySelector(`[data-assignment-id="${applyAssignmentId}"]`);
          console.log('Assignment element found:', !!assignmentElement);
          
          if (assignmentElement) {
            assignmentElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            // Add a highlight effect
            assignmentElement.classList.add('ring-4', 'ring-teal-400', 'ring-opacity-75');
            setTimeout(() => {
              assignmentElement.classList.remove('ring-4', 'ring-teal-400', 'ring-opacity-75');
            }, 3000);
          }
        }, 1000); // Increased delay to ensure rendering
        
        // Clean up the URL parameter
        if (typeof window !== 'undefined') {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
  }, [searchParams, allAssignments]);

  // --- Filtering Logic ---
  const filteredAssignments = useMemo(() => {
    const keyword = debouncedSearchKeyword.toLowerCase();
    return allAssignments
      .filter(assignment => assignment.status === 'Open') // Only show open assignments
      .filter(assignment => levelFilter ? assignment.level === levelFilter : true)
      .filter(assignment => subjectFilter ? assignment.subject === subjectFilter : true)
      .filter(assignment => keyword ? (assignment.title.toLowerCase().includes(keyword) || assignment.location.toLowerCase().includes(keyword)) : true);
  }, [allAssignments, levelFilter, subjectFilter, debouncedSearchKeyword]);

  // --- Reset to page 1 when filters change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAssignments]);

  // --- Pagination Logic ---
  const indexOfLastAssignment = currentPage * ASSIGNMENTS_PER_PAGE;
  const indexOfFirstAssignment = indexOfLastAssignment - ASSIGNMENTS_PER_PAGE;
  const currentAssignments = filteredAssignments.slice(indexOfFirstAssignment, indexOfLastAssignment);
  const totalPages = Math.ceil(filteredAssignments.length / ASSIGNMENTS_PER_PAGE);

  // --- Dynamic Subject List ---
  const availableSubjects = useMemo(() => {
    if (!levelFilter || !LEVEL_SUBJECT_MAPPINGS[levelFilter]) return SUBJECTS;
    return [...LEVEL_SUBJECT_MAPPINGS[levelFilter], 'Multiple Subjects', 'All Subjects'];
  }, [levelFilter]);

  useEffect(() => {
    if (levelFilter && subjectFilter && !availableSubjects.includes(subjectFilter)) {
      setSubjectFilter('');
    }
  }, [levelFilter, availableSubjects, subjectFilter]);

  // --- Handle pagination for selected assignment ---
  useEffect(() => {
    if (selectedAssignments.length === 1 && filteredAssignments.length > 0) {
      const selectedId = selectedAssignments[0];
      const assignmentIndex = filteredAssignments.findIndex(a => a._id === selectedId);
      
      if (assignmentIndex !== -1) {
        const targetPage = Math.ceil((assignmentIndex + 1) / ASSIGNMENTS_PER_PAGE);
        console.log('Setting page for assignment:', { assignmentIndex, targetPage, currentPage });
        
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    }
  }, [selectedAssignments, filteredAssignments, currentPage]);

  // --- Event Handlers ---
  const handleAssignmentSelect = useCallback((assignmentId) => {
    setSelectedAssignments(prev => prev.includes(assignmentId) ? prev.filter(id => id !== assignmentId) : [...prev, assignmentId]);
  }, []);

  const handleToggleExpand = useCallback((assignmentId) => {
    setExpandedAssignments(prev => {
        const newSet = new Set(prev);
        newSet.has(assignmentId) ? newSet.delete(assignmentId) : newSet.add(assignmentId);
        return newSet;
    });
  }, []);

  const handleSelectAllVisible = () => {
    const visibleIds = currentAssignments.map(a => a._id);
    const allVisibleSelected = visibleIds.every(id => selectedAssignments.includes(id));
    if (allVisibleSelected) {
        setSelectedAssignments(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
        setSelectedAssignments(prev => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleApplyClick = () => selectedAssignments.length > 0 && setShowModal(true);

  const handleVerifyAndSubmit = async (identifier) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    try {
      const verifyResponse = await fetch(`${backendUrl}/api/tutors/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      if (!verifyResponse.ok) throw new Error('Verification failed. Check your details.');
      const verificationData = await verifyResponse.json();
      if (verificationData.exists) {
        const applyResponse = await fetch(`${backendUrl}/api/assignments/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignmentIds: selectedAssignments, tutorId: verificationData.tutor.id }),
        });
        if (!applyResponse.ok) throw new Error('Application submission failed.');
        const appliedAssignmentsData = allAssignments.filter(a => selectedAssignments.includes(a._id));
        setSelectedAssignments([]);
        return appliedAssignmentsData;
      } else {
        alert('Tutor profile not found. Redirecting to registration...');
        router.push('/register-tutor');
        return 'redirect';
      }
    } catch (error) {
      console.error('Application error:', error);
      throw error;
    }
  };

  const closeModal = () => setShowModal(false);
  const resetFilters = () => {
    setLevelFilter('');
    setSubjectFilter('');
    setSearchKeyword('');
  };

  return (
    <>
      <Head>
        <title>Premium Tuition Assignments in Singapore | LionCity Tutors</title>
        <meta name="description" content={`Browse ${allAssignments.length}+ high-quality tuition assignments. Find your next tutoring opportunity in Singapore.`} />
      </Head>
      <div className="min-h-screen bg-slate-50 font-sans">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tighter mb-3">Find Your Next Tutoring Opportunity</h1>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto">Browse our curated list of premium tuition assignments across Singapore. New opportunities added daily.</p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">{filteredAssignments.length}</span>
                <span>of</span>
                <span className="font-semibold">{allAssignments.length}</span>
                <span>verified assignments available</span>
            </div>
          </header>
          <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="level-filter" className="block text-sm font-semibold text-slate-700 mb-2">Education Level</label>
                <select id="level-filter" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition">
                  <option value="">All Levels</option>
                  {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="subject-filter" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <select id="subject-filter" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition">
                  <option value="">All Subjects</option>
                  {availableSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="search-input" className="block text-sm font-semibold text-slate-700 mb-2">Search by Title or Location</label>
                <div className="relative">
                  <input id="search-input" type="text" placeholder="e.g., 'JC H2 Math' or 'Tampines'..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="h-5 w-5 text-slate-400" /></div>
                </div>
              </div>
            </div>
             <div className="h-px bg-slate-200 my-6"></div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {(levelFilter || subjectFilter || searchKeyword) && (<button onClick={resetFilters} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition flex items-center"><X className="h-4 w-4 mr-1"/> Clear Filters</button>)}
                </div>
                 <button onClick={handleSelectAllVisible} className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1.5"/>Select All on Page
                </button>
             </div>
          </section>
          <section className="pb-32">
            {currentAssignments.length > 0 ? (
                <div>
                    {currentAssignments.map(assignment => (
                        <AssignmentCard
                            key={assignment._id}
                            assignment={assignment}
                            isSelected={selectedAssignments.includes(assignment._id)}
                            isExpanded={expandedAssignments.has(assignment._id)}
                            onSelect={handleAssignmentSelect}
                            onToggleExpand={handleToggleExpand}
                        />
                    ))}
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            ) : (
              <div className="text-center bg-white rounded-2xl shadow-lg py-20 px-8">
                <Book className="mx-auto h-16 w-16 text-slate-300 mb-6" strokeWidth={1} />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Assignments Found</h3>
                <p className="text-slate-500 max-w-md mx-auto">Your search and filter combination did not match any assignments. Try adjusting your criteria.</p>
                <button onClick={resetFilters} className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105">Clear All Filters</button>
              </div>
            )}
          </section>
          <VerificationModal isOpen={showModal} onClose={closeModal} onSubmit={handleVerifyAndSubmit} selectedAssignments={selectedAssignments}/>
          <AnimatePresence>
            {!showModal && selectedAssignments.length > 0 && (
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-lg border border-slate-700 shadow-2xl z-50 rounded-2xl overflow-hidden w-[95%] max-w-2xl">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-white">{selectedAssignments.length} Assignment{selectedAssignments.length !== 1 ? 's' : ''} Selected</span>
                            <button onClick={() => setSelectedAssignments([])} className="text-sm text-slate-400 hover:text-white transition">Clear</button>
                        </div>
                        <button onClick={handleApplyClick} className="font-bold py-3 px-6 rounded-xl transition-all duration-300 transform bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-xl hover:scale-105 text-white flex items-center gap-2">
                            Apply Now <ArrowRight className="h-5 w-5"/>
                        </button>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}