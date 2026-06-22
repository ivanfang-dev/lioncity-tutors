import React from "react";

// Shared progress header for the multi-step tutor request form.
// Renders text labels on desktop, numbered circles on mobile, and a fill bar.
const STEP_LABELS = ["Your Details", "Lesson Details", "Tutor Preferences"];

export default function FormStepper({ currentStep }) {
    return (
        <div className="mb-8">
            {/* Desktop: Text labels */}
            <div className="hidden sm:flex justify-between mb-1">
                {STEP_LABELS.map((label, i) => (
                    <span
                        key={label}
                        className={`text-sm font-medium ${currentStep >= i + 1 ? "text-primary" : "text-gray-400"}`}
                    >
                        {label}
                    </span>
                ))}
            </div>

            {/* Mobile: Numbered circles */}
            <div className="flex sm:hidden justify-between px-4 mb-4">
                {STEP_LABELS.map((_, i) => {
                    const num = i + 1;
                    return (
                        <div key={num} className="flex flex-col items-center gap-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                                    currentStep >= num ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {num}
                            </div>
                            <span className="text-xs text-gray-500">Step {num}</span>
                        </div>
                    );
                })}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / STEP_LABELS.length) * 100}%` }}
                />
            </div>
        </div>
    );
}
