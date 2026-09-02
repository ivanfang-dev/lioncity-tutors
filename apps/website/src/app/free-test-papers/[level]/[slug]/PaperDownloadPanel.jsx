"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { gaEvent } from "@/utils/analytics";

// The library gates downloads behind a dialog. On a page about one paper the
// dialog is a wasted tap, so the same gate renders inline instead.
export default function PaperDownloadPanel({ paper }) {
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    if (email || phone) setFormData({ email: email || "", phone: phone || "" });
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address.";
    }
    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{8,}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Enter a valid phone number (at least 8 digits).";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("phone", formData.phone);

    try {
      const response = await fetch("/api/test-paper-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          level: paper.levelLabel,
          subject: paper.subject,
          paperTitle: paper.title,
          paperKey: paper.paperKey,
          fileKey: paper.fileKey,
        }),
      });

      if (!response.ok) throw new Error("API submission failed");
      const result = await response.json().catch(() => ({}));

      gaEvent("paper_download", {
        paper_title: paper.title,
        paper_key: paper.paperKey,
        subject: paper.subject,
        level: paper.levelLabel,
      });

      toast.success("Thank you! Your download will begin shortly.", {
        description: "Check your email for additional study resources.",
        duration: 5000,
      });

      const url = result.downloadUrl || paper.downloadUrl;
      if (url) window.open(url, "_blank");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.", {
        description: "If the problem persists, please contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      aria-labelledby="download-heading"
    >
      <h2 id="download-heading" className="text-xl font-bold text-gray-900">
        Download this paper
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Free, no payment. We send the paper and a short note on what to revise next.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-800">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={Boolean(formErrors.email)}
            aria-describedby={formErrors.email ? "email-error" : undefined}
            className="mt-1.5 min-h-11"
          />
          {formErrors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-600">
              {formErrors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-800">
            Mobile number
          </Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="8123 4567"
            aria-invalid={Boolean(formErrors.phone)}
            aria-describedby={formErrors.phone ? "phone-error" : undefined}
            className="mt-1.5 min-h-11"
          />
          {formErrors.phone && (
            <p id="phone-error" className="mt-1.5 text-sm text-red-600">
              {formErrors.phone}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="h-5 w-5" aria-hidden="true" />
        )}
        {isSubmitting ? "Preparing your paper…" : "Download the paper"}
      </Button>
    </form>
  );
}
