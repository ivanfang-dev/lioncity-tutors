import React, {useState, useEffect} from 'react';
import { Info, Loader2, Plus, X } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
    <select
      className={`flex h-12 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-base ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  ));
Select.displayName = 'Select';

// ===================================
// STEP 1: Your Details
// ===================================
export const Step1 = ({ nextStep, formData, handleChange, handleLevelSubjectChange, addLevelSubject, removeLevelSubject, errors }) => ( // <-- 1. Accept `errors` prop here
  <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold text-slate-800">Step 1: Your Details</h3>
      <div className="space-y-4">
          <div>
              <Label htmlFor="name" className="text-base font-medium text-slate-700">Name<span className="text-red-500 -ml-0.5">*</span></Label>
              <Input
                  id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                  placeholder="e.g., Jane Doe"
                  className={cn('mt-1 h-12 text-base', errors.name && 'border-red-500 focus-visible:ring-red-500')}
              />
              {/* 2. Add this block to display the error */}
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
              <Label htmlFor="mobile" className="text-base font-medium text-slate-700">Mobile Number<span className="text-red-500 -ml-0.5">*</span></Label>
              <Input
                  id="mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange}
                  placeholder="e.g., 9123 4567"
                  className={cn('mt-1 h-12 text-base', errors.mobile && 'border-red-500 focus-visible:ring-red-500')}
              />
              {/* 2. Add this block to display the error */}
              {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
          </div>
          <div>
              <Label className="text-base font-medium text-slate-700">Student's Level &amp; Subject<span className="text-red-500 -ml-0.5">*</span></Label>
              <p className="text-sm text-slate-500 mt-0.5">Need help with more than one subject? Add each one — we can match a tutor who covers them.</p>
              <div className="space-y-2 mt-2">
                  {(formData.levelSubjects || ['']).map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                          <Input
                              type="text"
                              value={entry}
                              onChange={(e) => handleLevelSubjectChange(index, e.target.value)}
                              placeholder={index === 0 ? "e.g., Secondary 3 A-Math" : "e.g., Secondary 3 Chemistry"}
                              className={cn('h-12 text-base', errors.levelSubjects && index === 0 && 'border-red-500 focus-visible:ring-red-500')}
                          />
                          {(formData.levelSubjects || ['']).length > 1 && (
                              <button
                                  type="button"
                                  onClick={() => removeLevelSubject(index)}
                                  aria-label="Remove this subject"
                                  className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                  <X size={18} />
                              </button>
                          )}
                      </div>
                  ))}
              </div>
              {errors.levelSubjects && <p className="text-red-600 text-sm mt-1">{errors.levelSubjects}</p>}
              <button
                  type="button"
                  onClick={addLevelSubject}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                  <Plus size={16} /> Add another subject
              </button>
          </div>
      </div>
      <div className="flex justify-end pt-4">
          <Button type="button" onClick={nextStep} variant="accent" size="lg" className="w-full sm:w-auto py-3 text-base">Next Step</Button>
      </div>
  </div>
);

// ===================================
// STEP 2: Lesson Details
// ===================================
export const Step2 = ({ nextStep, prevStep, formData, handleChange, errors }) => (
  <div className="space-y-6 animate-fadeIn">
    <h3 className="text-2xl font-bold text-slate-800">Step 2: Lesson Details</h3>
    <div>
        <Label htmlFor="location" className="text-base font-medium text-slate-700">Location<span className="text-red-500 -ml-0.5">*</span></Label>
        <Input
            id="location" name="location" type="text" value={formData.location} onChange={handleChange}
            placeholder="e.g., Bishan, Sengkang, or Postal Code"
            className={cn('mt-1 h-12 text-base', errors.location && 'border-red-500 focus-visible:ring-red-500')}
        />
        {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="lessonDuration" className="text-base font-medium text-slate-700">Lesson Duration</Label>
        <Select id="lessonDuration" name="lessonDuration" value={formData.lessonDuration} onChange={handleChange} className="mt-1">
          <option>1.5 Hours</option>
          <option>2 Hours</option>
          <option value="Others">Others (Please specify)</option>
        </Select>
        {formData.lessonDuration === "Others" && (
          <Input type="text" name="customDuration" value={formData.customDuration} onChange={handleChange} placeholder="e.g., 2.5 Hours" className="mt-2 h-12 text-base" />
        )}
      </div>
      <div>
        <Label htmlFor="lessonFrequency" className="text-base font-medium text-slate-700">Lesson Frequency</Label>
        <Select id="lessonFrequency" name="lessonFrequency" value={formData.lessonFrequency} onChange={handleChange} className="mt-1">
          <option>1 Lesson/Week</option>
          <option>2 Lessons/Week</option>
          <option value="Others">Others (Please specify)</option>
        </Select>
        {formData.lessonFrequency === "Others" && (
          <Input type="text" name="customFrequency" value={formData.customFrequency} onChange={handleChange} placeholder="e.g., 3 Lessons/Week" className="mt-2 h-12 text-base" />
        )}
      </div>
    </div>
    <div>
      <Label htmlFor="preferredTime" className="text-base font-medium text-slate-700">Preferred Days & Time</Label>
      <Input id="preferredTime" name="preferredTime" type="text" value={formData.preferredTime} onChange={handleChange} placeholder="e.g., Weekday evenings after 5pm" className="mt-1 h-12 text-base" />
    </div>
    <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
      <Button type="button" onClick={prevStep} variant="outline" size="lg" className="w-full sm:w-auto py-3 text-base">Go Back</Button>
      <Button type="button" onClick={nextStep} variant="accent" size="lg" className="w-full sm:w-auto py-3 text-base">Next Step</Button>
    </div>
  </div>
);

// ===================================
// STEP 3: Tutor Preferences
// ===================================
export const Step3 = ({ prevStep, formData, handleChange, status }) => {
  const [openInfo, setOpenInfo] = useState(null);
  // Read-only budget guidance (roadmap Phase 8): the typical rate tutors ask for the chosen level,
  // fetched from the bot's aggregate rate-guide. Informational only — it never gates the budget the
  // parent can enter. Silent when the level is unrecognized or data is sparse (typical stays null).
  const [rateHint, setRateHint] = useState(null);
  const levelSubject = (formData.levelSubjects || [])[0] || '';

  useEffect(() => {
    const level = levelSubject.trim();
    if (!level) { setRateHint(null); return; }
    let cancelled = false;
    const params = new URLSearchParams({ level });
    fetch(`/api/rate-guide?${params.toString()}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (!cancelled) setRateHint(data?.typical || null); })
      .catch(() => { if (!cancelled) setRateHint(null); });
    return () => { cancelled = true; };
  }, [levelSubject]);

  const handleInfoToggle = (tutorType) => {
      setOpenInfo(openInfo === tutorType ? null : tutorType);
  };

  return (
      <div className="space-y-8 animate-fadeIn">
          <h3 className="text-2xl font-bold text-slate-800">Step 3: Tutor Preferences</h3>

          {/* Tutor Type Section */}
          <div className="border border-slate-200 rounded-xl p-6 space-y-5">
              <h4 className="text-lg font-semibold text-slate-800">Tutor Type (Select all that apply)</h4>
              
              {/* Part-Time Tutors */}
              <div className="flex items-start">
                  <input type="checkbox" id="tutorType.partTime" name="tutorType.partTime" checked={formData.tutorType.partTime} onChange={handleChange} className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                      <Label htmlFor="tutorType.partTime" className="text-base flex items-center">
                          Part-Time Tutors <span className="text-sm text-slate-500 ml-2">($25-$40/hr)</span>
                          <div className="relative group ml-2">
                              <Info size={16} className="text-blue-600 cursor-pointer" onClick={() => handleInfoToggle('partTime')} />
                              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white border border-gray-200 p-3 rounded-lg shadow-xl z-10 ${openInfo === 'partTime' ? 'block' : 'hidden'} lg:group-hover:block`}>
                                  <p className="font-bold text-gray-800 mb-2">Part-Time Tutors</p>
                                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                                      <li>University Undergraduates</li>
                                      <li>Budget-friendly</li>
                                      <li>Relatable for students</li>
                                  </ul>
                              </div>
                          </div>
                      </Label>
                  </div>
              </div>
              
              {/* Full-Time Tutors */}
              <div className="flex items-start">
                  <input type="checkbox" id="tutorType.fullTime" name="tutorType.fullTime" checked={formData.tutorType.fullTime} onChange={handleChange} className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                      <Label htmlFor="tutorType.fullTime" className="text-base flex items-center">
                          Full-Time Tutors <span className="text-sm text-slate-500 ml-2">($40-$60/hr)</span>
                          <div className="relative group ml-2">
                              <Info size={16} className="text-blue-600 cursor-pointer" onClick={() => handleInfoToggle('fullTime')} />
                              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white border border-gray-200 p-3 rounded-lg shadow-xl z-10 ${openInfo === 'fullTime' ? 'block' : 'hidden'} lg:group-hover:block`}>
                                  <p className="font-bold text-gray-800 mb-2">Full-Time Tutors</p>
                                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                                      <li>At least 5 years of experience</li>
                                      <li>High level of commitment</li>
                                      <li>Often provide own materials</li>
                                  </ul>
                              </div>
                          </div>
                      </Label>
                  </div>
              </div>

              {/* MOE Teachers */}
              <div className="flex items-start">
                  <input type="checkbox" id="tutorType.moeTeacher" name="tutorType.moeTeacher" checked={formData.tutorType.moeTeacher} onChange={handleChange} className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                      <Label htmlFor="tutorType.moeTeacher" className="text-base flex items-center">
                          Ex/Current MOE Teachers <span className="text-sm text-slate-500 ml-2">($60-$120/hr)</span>
                            <div className="relative group ml-2">
                              <Info size={16} className="text-blue-600 cursor-pointer" onClick={() => handleInfoToggle('moeTeacher')} />
                              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white border border-gray-200 p-3 rounded-lg shadow-xl z-10 ${openInfo === 'moeTeacher' ? 'block' : 'hidden'} lg:group-hover:block`}>
                                  <p className="font-bold text-gray-800 mb-2">Ex/Current MOE Teachers</p>
                                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                                      <li>MOE & NIE trained</li>
                                      <li>Familiar with exam marking</li>
                                      <li>Most qualified and experienced</li>
                                  </ul>
                              </div>
                          </div>
                      </Label>
                  </div>
              </div>
          </div>

        {/* Budget Section */}
        <div className="border border-slate-200 rounded-xl p-6 space-y-5">
            <h4 className="text-lg font-semibold text-slate-800">Your Budget</h4>
            {rateHint && (
                <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 p-3">
                    <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900">
                        Typical rate for this level: <span className="font-semibold">${rateHint.p25}–${rateHint.p75}/hr</span>
                        <span className="text-blue-800"> (median ${rateHint.p50}). Just a guide — you're free to set any budget.</span>
                    </p>
                </div>
            )}
            <div className="flex items-center">
                <input type="radio" id="budgetMarketRate" name="budget.type" value="marketRate" checked={formData.budget.type === 'marketRate'} onChange={handleChange} className="h-5 w-5 text-blue-600 border-slate-400 focus:ring-blue-500" />
                <Label htmlFor="budgetMarketRate" className="ml-3 text-base">Follow market rates</Label>
            </div>
            <div className="flex items-center">
                <input type="radio" id="budgetCustom" name="budget.type" value="custom" checked={formData.budget.type === 'custom'} onChange={handleChange} className="h-5 w-5 text-blue-600 border-slate-400 focus:ring-blue-500" />
                <Label htmlFor="budgetCustom" className="ml-3 text-base">Set my own budget</Label>
            </div>
            {formData.budget.type === 'custom' && (
                <div className="pl-8 pt-2">
                    <Input type="number" name="budget.customAmount" value={formData.budget.customAmount} onChange={handleChange} placeholder="Enter your budget per hour" className="h-12 text-base" />
                </div>
            )}
        </div>

        <div>
            <Label htmlFor="preferences" className="text-base font-medium text-slate-700">Additional Requirements</Label>
            <Textarea id="preferences" name="preferences" value={formData.preferences} onChange={handleChange} rows="4" placeholder="e.g., Request for a patient tutor, specific gender preference, etc." className="mt-1 text-base" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
            <Button type="button" onClick={prevStep} variant="outline" size="lg" className="w-full sm:w-auto py-3 text-base">Go Back</Button>
            <Button type="submit" size="lg" variant="accent" className="w-full sm:w-auto py-3 text-base" disabled={status.submitting}>
                {status.submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {status.submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
        </div>
    </div>
  )
};