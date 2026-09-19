"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import LeadRoleField, { ROLE_REQUIRED, downloadToast } from "@/components/LeadRoleField";
import { Download, FileText, Loader2 } from "lucide-react";
import { gaEvent } from "@/utils/analytics";

// A group page holds up to 19 papers, so the gate cannot be an inline form per
// row. One dialog serves all of them, prefilled from the last download — the
// same shape the shelf uses, and the same lead is still recorded per paper.
export default function GroupDownload({ group }) {
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ email: "", phone: "", role: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const role = localStorage.getItem("role");
    if (email || phone || role) setFormData({ email: email || "", phone: phone || "", role: role || "" });
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
    if (!formData.role) errors.role = ROLE_REQUIRED;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !validate()) {
      if (selected) toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("phone", formData.phone);
    localStorage.setItem("role", formData.role);

    try {
      const response = await fetch("/api/test-paper-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          level: group.levelLabel,
          subject: group.subject,
          paperTitle: selected.title,
          paperKey: selected.paperKey,
          fileKey: selected.fileKey,
        }),
      });

      if (!response.ok) throw new Error("API submission failed");
      const result = await response.json().catch(() => ({}));

      gaEvent("paper_download", {
        paper_title: selected.title,
        paper_key: selected.paperKey,
        subject: group.subject,
        level: group.levelLabel,
      });

      downloadToast(formData.role);

      setSelected(null);
      setFormErrors({});

      const url = result.downloadUrl || selected.downloadUrl;
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
    <>
      <ul className="space-y-2">
        {group.papers.map((paper) => (
          <li
            key={paper.slug}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              <div className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-gray-900 sm:text-base">
                  {paper.school}
                </span>
                <span className="mt-1 block text-sm text-gray-600">
                  {paper.isSolutions ? "Worked solutions" : "Exam paper"}
                  {paper.hasAnswers && !paper.isSolutions ? " · answers included" : ""}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(paper)}
              aria-label={`Download ${paper.title}`}
              className="flex min-h-11 w-full flex-shrink-0 items-center justify-center gap-2 sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="rounded-2xl sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Download: {selected?.school} {group.shortSubject} {group.year} {group.examLabel}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Free, no payment. We send the paper and a short note on what to revise next.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-800">Email</Label>
              <Input
                id="email" type="email" inputMode="email" autoComplete="email"
                value={formData.email} onChange={handleChange} placeholder="you@example.com"
                aria-invalid={Boolean(formErrors.email)}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                className="mt-1.5 min-h-11"
              />
              {formErrors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-error-text">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-800">Mobile number</Label>
              <Input
                id="phone" type="tel" inputMode="tel" autoComplete="tel"
                value={formData.phone} onChange={handleChange} placeholder="8123 4567"
                aria-invalid={Boolean(formErrors.phone)}
                aria-describedby={formErrors.phone ? "phone-error" : undefined}
                className="mt-1.5 min-h-11"
              />
              {formErrors.phone && (
                <p id="phone-error" className="mt-1.5 text-sm text-error-text">{formErrors.phone}</p>
              )}
            </div>

            <LeadRoleField
              value={formData.role}
              onChange={(role) => {
                setFormData((prev) => ({ ...prev, role }));
                setFormErrors((prev) => ({ ...prev, role: undefined }));
              }}
              error={formErrors.role}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold"
            >
              {isSubmitting
                ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                : <Download className="h-5 w-5" aria-hidden="true" />}
              {isSubmitting ? "Preparing your paper…" : "Download the paper"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
