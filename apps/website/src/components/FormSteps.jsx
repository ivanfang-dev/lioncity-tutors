import React, {useState, useEffect, useMemo} from 'react';
import { Info, Loader2, Plus, X } from 'lucide-react';
import { RATE_CARD, RATES_REVIEWED, bandFor, bandForLevelText, spanFor, hourlyLabel } from '@/app/tuition-rates/rates.mjs';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Tokens, not the stock slate/blue ramp: the focus ring is the project's
// `--color-ring` (#D9691C, 3.5:1) rather than `blue-500`, which is a different
// blue from Harbour Blue and read as a second unowned brand colour on the one
// screen a parent actually has to work through.
const Select = React.forwardRef(({ className, children, ...props }, ref) => (
    <select
      className={cn(
        'flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base text-text-default shadow-xs outline-none transition-colors',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  ));
Select.displayName = 'Select';

/**
 * The rate-band explainer beside each tutor type.
 *
 * Three things were wrong with the inline version this replaces, and all three
 * only bit on mobile:
 *
 *  1. The panel was `absolute left-1/2 -translate-x-1/2 w-72` — 288px centred on
 *     a 16px icon sitting far to the right of a card whose usable width is about
 *     230px. It hung off the side of the screen on every phone.
 *  2. The trigger was a bare `<svg onClick>`: not focusable, not announced, and
 *     not operable by keyboard.
 *  3. It lived INSIDE the `<label>`, so tapping it also toggled the checkbox it
 *     was explaining. On desktop the panel opens on hover so nobody clicked it;
 *     on touch there is no hover, so every parent who tapped "what does this
 *     mean?" silently selected or deselected that tutor type.
 *
 * It is now a real button outside the label, and the panel is a normal block
 * that pushes layout instead of floating — nothing to position, nothing to clip.
 */
const TypeInfo = ({ id, title, points, open, onToggle }) => (
  <div className="mt-1">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`${id}-info`}
      className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-primary transition-colors hover:text-primary/80"
    >
      <Info size={16} aria-hidden="true" />
      <span>{open ? 'Hide details' : "What's this?"}</span>
    </button>
    <div
      id={`${id}-info`}
      hidden={!open}
      className="mt-2 rounded-lg border border-border bg-background-subtle p-3"
    >
      <p className="font-semibold text-text-default mb-1">{title}</p>
      <ul className="text-sm text-text-secondary space-y-1 list-disc pl-4">
        {points.map((point) => <li key={point}>{point}</li>)}
      </ul>
    </div>
  </div>
);

// ===================================
// STEP 1: Your Details
// ===================================
export const Step1 = ({ nextStep, formData, handleChange, handleLevelSubjectChange, addLevelSubject, removeLevelSubject, errors }) => ( // <-- 1. Accept `errors` prop here
  <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold text-text-default">Step 1: Your Details</h3>
      <div className="space-y-4">
          <div>
              <Label htmlFor="name" className="text-base font-medium text-text-secondary">Name<span className="text-error-text -ml-0.5" aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
              <Input
                  id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                  autoComplete="name"
                  placeholder="e.g., Jane Doe"
                  className={cn('mt-1 h-12 text-base', errors.name && 'border-error focus-visible:ring-error/40')}
              />
              {/* 2. Add this block to display the error */}
              {errors.name && <p className="text-sm text-error-text mt-1.5">{errors.name}</p>}
          </div>
          <div>
              <Label htmlFor="mobile" className="text-base font-medium text-text-secondary">Mobile Number<span className="text-error-text -ml-0.5" aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
              <Input
                  id="mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange}
                  autoComplete="tel" inputMode="tel"
                  placeholder="e.g., 9123 4567"
                  className={cn('mt-1 h-12 text-base', errors.mobile && 'border-error focus-visible:ring-error/40')}
              />
              {/* 2. Add this block to display the error */}
              {errors.mobile && <p className="text-sm text-error-text mt-1.5">{errors.mobile}</p>}
          </div>
          <div>
              <Label className="text-base font-medium text-text-secondary">Student's Level &amp; Subject<span className="text-error-text -ml-0.5" aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
              <p className="text-sm text-text-tertiary mt-0.5">Need help with more than one subject? Add each one — we can match a tutor who covers them.</p>
              <div className="space-y-2 mt-2">
                  {(formData.levelSubjects || ['']).map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                          <Input
                              type="text"
                              value={entry}
                              onChange={(e) => handleLevelSubjectChange(index, e.target.value)}
                              placeholder={index === 0 ? "e.g., Secondary 3 A-Math" : "e.g., Secondary 3 Chemistry"}
                              className={cn('h-12 text-base', errors.levelSubjects && index === 0 && 'border-error focus-visible:ring-error/40')}
                          />
                          {(formData.levelSubjects || ['']).length > 1 && (
                              <button
                                  type="button"
                                  onClick={() => removeLevelSubject(index)}
                                  aria-label="Remove this subject"
                                  className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md text-text-tertiary hover:text-error hover:bg-error/10 transition-colors"
                              >
                                  <X size={18} />
                              </button>
                          )}
                      </div>
                  ))}
              </div>
              {errors.levelSubjects && <p className="text-sm text-error-text mt-1.5">{errors.levelSubjects}</p>}
              <button
                  type="button"
                  onClick={addLevelSubject}
                  className="mt-2 inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                  <Plus size={16} /> Add another subject
              </button>
          </div>
      </div>
      <div className="flex justify-end pt-4">
          <Button type="button" onClick={nextStep} variant="accent" size="lg" className="w-full sm:w-auto min-h-11 py-3">Next Step</Button>
      </div>
  </div>
);

// ===================================
// STEP 2: Lesson Details
// ===================================
export const Step2 = ({ nextStep, prevStep, formData, handleChange, errors }) => (
  <div className="space-y-6 animate-fadeIn">
    <h3 className="text-2xl font-bold text-text-default">Step 2: Lesson Details</h3>
    <div>
        <Label htmlFor="location" className="text-base font-medium text-text-secondary">Location<span className="text-error-text -ml-0.5" aria-hidden="true">*</span><span className="sr-only"> (required)</span></Label>
        <Input
            id="location" name="location" type="text" value={formData.location} onChange={handleChange}
            autoComplete="address-level2"
            placeholder="e.g., Bishan, Sengkang, or Postal Code"
            className={cn('mt-1 h-12 text-base', errors.location && 'border-error focus-visible:ring-error/40')}
        />
        {errors.location && <p className="text-sm text-error-text mt-1.5">{errors.location}</p>}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="lessonDuration" className="text-base font-medium text-text-secondary">Lesson Duration</Label>
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
        <Label htmlFor="lessonFrequency" className="text-base font-medium text-text-secondary">Lesson Frequency</Label>
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
      <Label htmlFor="preferredTime" className="text-base font-medium text-text-secondary">Preferred Days & Time</Label>
      <Input id="preferredTime" name="preferredTime" type="text" value={formData.preferredTime} onChange={handleChange} placeholder="e.g., Weekday evenings after 5pm" className="mt-1 h-12 text-base" />
    </div>
    <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
      <Button type="button" onClick={prevStep} variant="outline" size="lg" className="w-full sm:w-auto min-h-11 py-3 text-base">Go Back</Button>
      <Button type="button" onClick={nextStep} variant="accent" size="lg" className="w-full sm:w-auto min-h-11 py-3">Next Step</Button>
    </div>
  </div>
);

// ===================================
// STEP 3: Tutor Preferences
// ===================================
// `rateType` maps each checkbox to a row in the rate card (src/app/tuition-rates/rates.mjs).
// Figures are read from there per level, so the form can't drift from /tuition-rates.
const TUTOR_TYPES = [
  {
    key: 'partTime',
    label: 'Part-Time Tutors',
    rateType: 'Undergraduate',
    title: 'Part-Time Tutors',
    points: ['University undergraduates', 'Budget-friendly', 'Relatable for students'],
  },
  {
    key: 'fullTime',
    label: 'Full-Time Tutors',
    rateType: 'Full-Time Tutor',
    title: 'Full-Time Tutors',
    points: ['At least 5 years of experience', 'High level of commitment', 'Often provide own materials'],
  },
  {
    key: 'moeTeacher',
    label: 'Ex/Current MOE Teachers',
    rateType: 'MOE-Trained Teacher',
    title: 'Ex/Current MOE Teachers',
    points: ['MOE & NIE trained', 'Familiar with exam marking', 'Most qualified and experienced'],
  },
];

export const Step3 = ({ prevStep, formData, handleChange, status }) => {
  const [openInfo, setOpenInfo] = useState(null);
  // Read-only budget guidance (roadmap Phase 8): the typical rate tutors ask for the chosen level,
  // fetched from the bot's aggregate rate-guide. Informational only — it never gates the budget the
  // parent can enter. Silent when the level is unrecognized or data is sparse (typical stays null).
  const [rateHint, setRateHint] = useState(null);
  const levelSubjects = formData.levelSubjects || [];
  const levelSubject = levelSubjects[0] || '';

  // Rate bands for the levels named in Step 1. Multiple levels span every matching
  // band; an unrecognised level falls back to spanning all of them.
  const rateBands = useMemo(() => {
    const ids = [...new Set(levelSubjects.map(bandForLevelText).filter(Boolean))];
    const ordered = RATE_CARD.map((b) => b.id).filter((id) => ids.includes(id));
    return {
      ids: ordered,
      caption: ordered.length === 1
        ? bandFor(ordered[0]).level
        : ordered.length > 1
          ? ordered.map((id) => bandFor(id).level).join(' and ')
          : 'all levels',
    };
  }, [levelSubjects.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <h3 className="text-2xl font-bold text-text-default">Step 3: Tutor Preferences</h3>

          {/* Tutor Type Section */}
          <div className="border border-border rounded-xl p-4 sm:p-6 space-y-5">
              <h4 className="text-lg font-semibold text-text-default">Tutor Type (Select all that apply)</h4>
              <p className="-mt-3 text-sm text-text-tertiary text-pretty">
                  Our rates for <span className="font-medium text-text-secondary">{rateBands.caption}</span>, reviewed {RATES_REVIEWED}.
              </p>

              {TUTOR_TYPES.map(({ key, label, rateType, title, points }) => (
                  <div key={key} className="flex items-start gap-3">
                      <input
                          type="checkbox"
                          id={`tutorType.${key}`}
                          name={`tutorType.${key}`}
                          checked={formData.tutorType[key]}
                          onChange={handleChange}
                          className="h-5 w-5 mt-0.5 flex-shrink-0 rounded border-gray-400"
                      />
                      <div className="min-w-0 flex-1">
                          {/* `flex-wrap` matters: the label, the rate band and the
                              old inline trigger sat in a non-wrapping flex row
                              inside a card whose content box is ~230px on a
                              phone, so "Ex/Current MOE Teachers ($60-$120/hr)"
                              had nowhere to go. */}
                          <Label htmlFor={`tutorType.${key}`} className="text-base flex flex-wrap items-baseline gap-x-2">
                              <span>{label}</span>
                              <span className="text-sm text-text-tertiary tabular-nums">
                                  {hourlyLabel(spanFor(rateBands.ids, rateType))}
                              </span>
                          </Label>
                          <TypeInfo
                              id={`tutorType.${key}`}
                              title={title}
                              points={points}
                              open={openInfo === key}
                              onToggle={() => handleInfoToggle(key)}
                          />
                      </div>
                  </div>
              ))}
          </div>

        {/* Budget Section */}
        <div className="border border-border rounded-xl p-4 sm:p-6 space-y-5">
            <h4 className="text-lg font-semibold text-text-default">Your Budget</h4>
            {rateHint && (
                <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 p-3">
                    <Info size={16} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm text-text-default text-pretty">
                        Typical rate for this level: <span className="font-semibold tabular-nums">${rateHint.p25}–${rateHint.p75}/hr</span>
                        <span className="text-text-secondary"> (median <span className="tabular-nums">${rateHint.p50}</span>). Just a guide — you're free to set any budget.</span>
                    </p>
                </div>
            )}
            {/* The whole row is the label, so the tap target is the full width of
                the card rather than a 20px circle — the difference between a
                confident tap and a missed one on a phone held in one hand. */}
            <label htmlFor="budgetMarketRate" className="flex items-center gap-3 cursor-pointer">
                <input type="radio" id="budgetMarketRate" name="budget.type" value="marketRate" checked={formData.budget.type === 'marketRate'} onChange={handleChange} className="h-5 w-5 flex-shrink-0 border-gray-400" />
                <span className="text-base">Follow market rates</span>
            </label>
            <label htmlFor="budgetCustom" className="flex items-center gap-3 cursor-pointer">
                <input type="radio" id="budgetCustom" name="budget.type" value="custom" checked={formData.budget.type === 'custom'} onChange={handleChange} className="h-5 w-5 flex-shrink-0 border-gray-400" />
                <span className="text-base">Set my own budget</span>
            </label>
            {formData.budget.type === 'custom' && (
                <div className="pl-8 pt-2">
                    <Input type="number" inputMode="decimal" min="0" name="budget.customAmount" value={formData.budget.customAmount} onChange={handleChange} placeholder="Enter your budget per hour" className="h-12 text-base" />
                </div>
            )}
        </div>

        {/* Tutor fit.
            `genderPreference` and `bilingualRequired` already existed in the
            request-tutor form's state and were POSTed on every submission — but
            no control ever rendered them, so every request carried the same two
            constants ("No preference" / "No") no matter what the family wanted.
            These are the controls that were missing. Both stay strings rather
            than booleans so the payload the backend already receives keeps its
            shape. */}
        <div className="border border-border rounded-xl p-4 sm:p-6 space-y-5">
            <h4 className="text-lg font-semibold text-text-default">Tutor Fit</h4>

            <div>
                <Label htmlFor="genderPreference" className="text-base font-medium text-text-secondary">Tutor gender</Label>
                <Select
                    id="genderPreference"
                    name="genderPreference"
                    value={formData.genderPreference ?? 'No preference'}
                    onChange={handleChange}
                    className="mt-1"
                >
                    <option>No preference</option>
                    <option>Female tutor</option>
                    <option>Male tutor</option>
                </Select>
                <p className="mt-1.5 text-sm text-text-tertiary">Most families leave this as no preference — it widens the pool and we match faster.</p>
            </div>

            <label htmlFor="bilingualRequired" className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    id="bilingualRequired"
                    name="bilingualRequired"
                    checked={(formData.bilingualRequired ?? 'No') === 'Yes'}
                    // Mapped to the 'Yes'/'No' strings the field has always carried,
                    // rather than switching the wire format to a boolean.
                    onChange={(e) => handleChange({
                        target: { name: 'bilingualRequired', value: e.target.checked ? 'Yes' : 'No', type: 'text' },
                    })}
                    className="h-5 w-5 mt-0.5 flex-shrink-0 rounded border-gray-400"
                />
                <span className="min-w-0">
                    <span className="block text-base">Tutor should be bilingual</span>
                    <span className="block text-sm text-text-tertiary">Useful for Chinese, Malay and Tamil, or if your child follows explanations better in their mother tongue.</span>
                </span>
            </label>
        </div>

        <div>
            <Label htmlFor="preferences" className="text-base font-medium text-text-secondary">Additional Requirements</Label>
            <Textarea id="preferences" name="preferences" value={formData.preferences} onChange={handleChange} rows="4" placeholder="e.g., patient with a shy child, experience with dyslexia, prefers to teach at our home." className="mt-1 text-base" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
            <Button type="button" onClick={prevStep} variant="outline" size="lg" className="w-full sm:w-auto min-h-11 py-3 text-base">Go Back</Button>
            <Button type="submit" size="lg" variant="accent" className="w-full sm:w-auto min-h-11 py-3" disabled={status.submitting}>
                {status.submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {status.submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
        </div>
    </div>
  )
};
/**
 * The three-step body, identical on every page that renders the request form.
 * Each page keeps its own surrounding chrome — heading, card, success message —
 * and passes in the object returned by useTuitionRequestForm.
 */
export const TuitionRequestSteps = ({ form }) => {
  const {
    currentStep, formData, errors, status,
    nextStep, prevStep, handleChange,
    handleLevelSubjectChange, addLevelSubject, removeLevelSubject,
  } = form;

  return (
    <>
      {currentStep === 1 && (
        <Step1
          nextStep={nextStep}
          formData={formData}
          handleChange={handleChange}
          handleLevelSubjectChange={handleLevelSubjectChange}
          addLevelSubject={addLevelSubject}
          removeLevelSubject={removeLevelSubject}
          errors={errors}
        />
      )}
      {currentStep === 2 && (
        <Step2
          nextStep={nextStep}
          prevStep={prevStep}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
      )}
      {currentStep === 3 && (
        <Step3
          prevStep={prevStep}
          formData={formData}
          handleChange={handleChange}
          status={status}
          errors={errors}
        />
      )}
    </>
  );
};
