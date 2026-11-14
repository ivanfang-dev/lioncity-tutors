"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BACKEND_URL } from "@/lib/backend";
import { MATCH_TIME } from "@/data/promises";
import { formatSgMobile, normalizeLeadPhone } from "@/lib/phone.mjs";
import { quickRequestPayload, dismissTutorOffer, markTutorRequested } from "@/lib/quickRequest.mjs";
import { gaEvent } from "@/utils/analytics";

const WHATSAPP_URL = "https://wa.me/6588701152";

// Shown inside the download dialog once a parent's file has started downloading.
export default function TutorOffer({ offer, onClose }) {
  const { level, subject, paperTitle, email, source } = offer;
  const [phone, setPhone] = useState(offer.phone);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("idle");

  const validPhone = normalizeLeadPhone(phone);
  const shownPhone = formatSgMobile(phone) || phone;

  const send = async () => {
    const payload = quickRequestPayload({ phone, email, level, subject, paperTitle, source });
    if (!payload) return;
    setStatus("sending");
    try {
      const response = await fetch(`${BACKEND_URL}/api/requestfortutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      markTutorRequested({ level, subject });
      gaEvent("quick_request", { subject, level, source });
      setStatus("sent");
    } catch (error) {
      console.error("Quick request error:", error);
      setStatus("error");
    }
  };

  const decline = () => {
    dismissTutorOffer();
    onClose();
  };

  if (status === "sent") {
    return (
      <div className="space-y-5">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
            Request received
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700">
            We&rsquo;ll WhatsApp {shownPhone} to confirm your area and schedule, then send {subject} tutor
            profiles within {MATCH_TIME}.
          </DialogDescription>
        </DialogHeader>
        <Button variant="outline" onClick={onClose} className="min-h-11 w-full">
          Back to the papers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DialogHeader className="space-y-2">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
          Your download has started
        </p>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Need a tutor for {subject}?
        </DialogTitle>
        <DialogDescription className="text-base text-gray-700">
          Tap once and we&rsquo;ll WhatsApp you to confirm your area and schedule, then send tutor
          profiles within {MATCH_TIME}. Free for parents.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Button
          variant="accent"
          onClick={send}
          disabled={status === "sending" || !validPhone}
          className="min-h-12 w-full rounded-full"
        >
          {status === "sending" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {status === "sending" ? "Sending…" : "Send me tutor profiles"}
        </Button>

        {editing ? (
          <div>
            <label htmlFor="offer-phone" className="block text-sm font-medium text-gray-800">
              WhatsApp number
            </label>
            <Input
              id="offer-phone" type="tel" inputMode="tel" autoComplete="tel"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!validPhone}
              aria-describedby={!validPhone ? "offer-phone-error" : undefined}
              className="mt-1.5 min-h-11"
            />
            {!validPhone && (
              <p id="offer-phone-error" className="mt-1.5 text-sm text-error-text">
                Enter a valid phone number (at least 8 digits).
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-600">
            to {shownPhone} ·{" "}
            <button type="button" onClick={() => setEditing(true)} className="font-medium text-primary-deep underline underline-offset-2">
              Change
            </button>
          </p>
        )}

        {status === "error" && (
          <p role="alert" className="text-center text-sm text-error-text">
            That didn&rsquo;t send. Try again, or{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
              message us on WhatsApp
            </a>.
          </p>
        )}
      </div>

      <Button variant="ghost" onClick={decline} className="min-h-11 w-full text-gray-600">
        No thanks
      </Button>
    </div>
  );
}
