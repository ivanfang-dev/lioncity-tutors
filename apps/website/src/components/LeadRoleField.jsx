"use client";

import { toast } from "sonner";
import { MATCH_TIME } from "@/data/promises";

const ROLES = [
  { value: "parent", label: "I'm a parent" },
  { value: "student", label: "I'm a student" },
];

// Parent-or-student choice on the download gates, so parent leads can be
// marketed to and student leads left alone.
export default function LeadRoleField({ value, onChange, error }) {
  return (
    <div>
      <span id="role-label" className="block text-sm font-semibold text-gray-800">Who is downloading?</span>
      <div
        role="radiogroup"
        aria-labelledby="role-label"
        aria-describedby={error ? "role-error" : undefined}
        className="mt-1.5 grid grid-cols-2 gap-2"
      >
        {ROLES.map((role) => {
          const checked = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(role.value)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                checked
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary"
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </div>
      {error && <p id="role-error" className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export const ROLE_REQUIRED = "Choose parent or student.";

// Students get a nudge to pass the page to a parent instead of the email promise.
export function downloadToast(role) {
  if (role !== "student") {
    toast.success("Thank you! Your download will begin shortly.", {
      description: "Check your email for additional study resources.",
      duration: 5000,
    });
    return;
  }
  toast.success("Your download will begin shortly.", {
    description: `Preparing for exams? Send this page to a parent. We can match a tutor within ${MATCH_TIME}.`,
    duration: 10000,
    action: { label: "Share", onClick: shareWithParent },
  });
}

async function shareWithParent() {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("Link copied. Paste it to a parent.");
  } catch {
    // Share sheet dismissed or clipboard blocked; nothing to recover.
  }
}
