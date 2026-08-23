// src/hooks/useTuitionRequestForm.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeSgMobile } from '@/lib/phone';

// Safe localStorage wrapper with error handling
const safeLocalStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('localStorage.getItem failed:', error);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('localStorage.setItem failed:', error);
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('localStorage.removeItem failed:', error);
        }
    }
};

const STORAGE_KEY = 'tutorRequestDraft';

const validateStep = (step, data) => {
    const newErrors = {};
    if (step === 1) {
        if (!data.name.trim()) newErrors.name = "Name is required.";
        if (!data.mobile.trim()) {
            newErrors.mobile = "Mobile number is required.";
        } else if (!normalizeSgMobile(data.mobile)) {
            // The number is parsed before it is judged, so spaces, hyphens and a
            // +65 prefix all pass. The message names the problem rather than
            // restating the rule the visitor thinks they already followed.
            newErrors.mobile = "That doesn't look like a Singapore mobile number — it should be 8 digits starting with 8 or 9.";
        }
        const filledSubjects = (data.levelSubjects || []).map(s => s.trim()).filter(Boolean);
        if (filledSubjects.length === 0) newErrors.levelSubjects = "At least one level & subject is required.";
    }
    if (step === 2) {
        if (!data.location.trim()) newErrors.location = "Location is required.";
    }
    // No validation needed for step 3 by default, but can be added here
    return newErrors;
};

// The one shape every request form starts from. It used to be retyped at each of
// the twelve call sites, and they drifted: only two seeded genderPreference and
// bilingualRequired, so the other ten POSTed a payload missing both fields unless
// the parent happened to touch those controls.
export const DEFAULT_REQUEST_FORM_STATE = {
    name: '',
    mobile: '',
    levelSubjects: [''],
    location: '',
    lessonDuration: '1.5 Hours',
    customDuration: '',
    lessonFrequency: '1 Lesson/Week',
    customFrequency: '',
    preferredTime: '',
    tutorType: { partTime: true, fullTime: false, moeTeacher: false },
    budget: { type: 'marketRate', customAmount: '' },
    genderPreference: 'No preference',
    bilingualRequired: 'No',
    preferences: ''
};

// Pages pass only what they prefill, e.g. { levelSubjects: ['PSLE Math'] }.
const useTuitionRequestForm = (overrides) => {
    const [initialFormData] = useState(() => ({ ...DEFAULT_REQUEST_FORM_STATE, ...overrides }));
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ submitting: false, submitted: false, error: null });

    // Load saved draft from localStorage on component mount
    useEffect(() => {
        const savedDraft = safeLocalStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // Migrate older drafts that stored a single `level` string into the
                // new `levelSubjects` array so the multi-subject form loads cleanly.
                if (!Array.isArray(parsed.levelSubjects)) {
                    parsed.levelSubjects = parsed.level ? [parsed.level] : [''];
                }
                delete parsed.level;
                // Merged onto the defaults, not swapped in: a draft saved before a
                // field existed would otherwise come back missing that field.
                setFormData({ ...initialFormData, ...parsed });
            } catch (error) {
                console.error('Failed to parse form draft:', error);
                // If parsing fails, remove the corrupted data
                safeLocalStorage.removeItem(STORAGE_KEY);
            }
        }
    }, [initialFormData]);

    // Save form data to localStorage on changes (only if not submitted)
    useEffect(() => {
        if (!status.submitted) {
            try {
                safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
            } catch (error) {
                console.error('Failed to save form draft:', error);
            }
        }
    }, [formData, status.submitted]);

    const nextStep = () => {
        const newErrors = validateStep(currentStep, formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setErrors({}); // Clear errors when going back
        setCurrentStep(prev => prev - 1);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        
        // Clear the error for the field being edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: inputValue }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: inputValue }));
        }
    };

    // --- Multiple level/subject entries (one submission can cover several subjects) ---
    const handleLevelSubjectChange = (index, value) => {
        if (errors.levelSubjects) {
            setErrors(prev => ({ ...prev, levelSubjects: null }));
        }
        setFormData(prev => {
            const next = [...(prev.levelSubjects || [''])];
            next[index] = value;
            return { ...prev, levelSubjects: next };
        });
    };

    const addLevelSubject = () => {
        setFormData(prev => ({ ...prev, levelSubjects: [...(prev.levelSubjects || ['']), ''] }));
    };

    const removeLevelSubject = (index) => {
        setFormData(prev => {
            const next = (prev.levelSubjects || ['']).filter((_, i) => i !== index);
            return { ...prev, levelSubjects: next.length ? next : [''] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allErrors = { ...validateStep(1, formData), ...validateStep(2, formData) };
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            // Force user back to the step with the first error
            if (allErrors.name || allErrors.mobile || allErrors.levelSubjects) {
                setCurrentStep(1);
            } else if (allErrors.location) {
                setCurrentStep(2);
            }
            return;
        }

        setStatus({ submitting: true, submitted: false, error: null });
        try {
            // Send the cleaned list plus a joined `level` string so the backend's existing
            // required `level` field and notifications keep working without changes.
            const cleanedSubjects = (formData.levelSubjects || []).map(s => s.trim()).filter(Boolean);
            const payload = {
                ...formData,
                levelSubjects: cleanedSubjects,
                level: cleanedSubjects.join('; '),
                // Send the bare 8 digits regardless of how it was typed. Now that
                // "+65 9123 4567" is accepted at the door, the backend and the
                // WhatsApp outreach must not have to cope with four spellings of
                // the same number — one shape goes over the wire.
                mobile: normalizeSgMobile(formData.mobile) || formData.mobile.trim(),
                // The form tracks budget as { type, customAmount }, but the backend Contact
                // schema/notification expect { marketRate, custom, customAmount } booleans.
                budget: {
                    marketRate: formData.budget?.type === 'marketRate',
                    custom: formData.budget?.type === 'custom',
                    customAmount: formData.budget?.customAmount || ''
                }
            };
            const response = await fetch('https://tuition-backend-afud.onrender.com/api/requestfortutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Form submission failed');
            }
            setStatus({ submitting: false, submitted: true, error: null });
            
            // Clear the saved draft from localStorage after successful submission
            safeLocalStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            setStatus({ submitting: false, submitted: false, error: error.message });
        }
    };
    
    const resetForm = () => {
        setFormData(initialFormData);
        setCurrentStep(1);
        setStatus({ submitting: false, submitted: false, error: null });
        setErrors({});
    }

    return {
        currentStep,
        formData,
        setFormData, // escape hatch for pages that pre-fill (e.g. URL params, preset buttons)
        errors,
        status,
        nextStep,
        prevStep,
        handleChange,
        handleLevelSubjectChange,
        addLevelSubject,
        removeLevelSubject,
        handleSubmit,
        resetForm
    };
};

export default useTuitionRequestForm;