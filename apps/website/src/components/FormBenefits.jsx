import React from "react";
import { CheckCircle } from "lucide-react";

// Shared reassurance row shown above the tutor request form.
const BENEFITS = ["Matched within 24 hours", "No hidden fees, ever"];

export default function FormBenefits() {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 mb-8">
            {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{benefit}</span>
                </div>
            ))}
        </div>
    );
}
