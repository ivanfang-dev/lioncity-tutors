"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BookOpen, GraduationCap, Atom, FileText, Search, Clock } from "lucide-react";
import { notesData } from "../../data/notesData.mjs";
import { LEVEL_TINTS } from "@/lib/levelTints";

// Counted from the data rather than typed into the copy, so the page can never
// claim more notes than it hosts.
const flatten = (node) => (Array.isArray(node) ? node : Object.values(node ?? {}).flatMap(flatten));
const noteCount = flatten(notesData).length;

// Parents search by exam, not by school stage, so the library is labelled
// PSLE / O-Level / A-Level. The keys stay primary/secondary/jc: they are what
// notesData and LEVEL_TINTS are keyed by.
const LEVEL_LABELS = {
  all: "All Levels",
  primary: "PSLE",
  secondary: "O-Level",
  jc: "A-Level",
};

// Coming Soon Component for empty arrays
const ComingSoonCard = ({ level, tint }) => (
  <div className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-colors ${tint.placeholder}`}>
    <Clock className={`h-8 w-8 mb-3 ${tint.placeholderIcon}`} />
    <p className="text-gray-500 font-medium text-center">
      Coming Soon
    </p>
    <p className="text-gray-400 text-sm text-center mt-1">
      {level} notes will be available soon
    </p>
  </div>
);

// Enhanced Note list item with better spacing and responsive design
const NoteListItem = ({ note, onDownloadClick, tint }) => (
  <li className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all duration-200 ${tint.rowHover}`}>
    <div className="flex items-start gap-3 min-w-0 flex-1">
      <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="font-medium text-gray-800 text-sm sm:text-base leading-tight block">
          {note.title}
        </span>
        {note.description && (
          <span className="text-xs text-gray-500 mt-1 block">{note.description}</span>
        )}
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      className={`flex min-h-11 items-center gap-2 transition-colors duration-200 flex-shrink-0 w-full sm:w-auto justify-center sm:min-h-0 ${tint.action}`}
      onClick={onDownloadClick}
      aria-label={`Download ${note.title}`}
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  </li>
);

// Subject card with search functionality and coming soon support
const SubjectCard = ({ subjectTitle, subjectData, onDownloadClick, searchTerm, tint }) => {
  // Filter notes based on search term
  const filterNotes = (notes) => {
    if (!searchTerm || !Array.isArray(notes)) return notes || [];
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredNotes = filterNotes(subjectData);
  
  // Hide card if no matching notes during search
  if (searchTerm && filteredNotes.length === 0) {
    return null;
  }

  const availableNotes = Array.isArray(subjectData) ? subjectData.length : 0;

  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out rounded-2xl overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h4 className="font-bold text-xl text-gray-900">{subjectTitle}</h4>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-auto">
            {availableNotes} notes available
          </div>
        </div>
        
        <div>
          {!Array.isArray(subjectData) || subjectData.length === 0 ? (
            <ComingSoonCard level={subjectTitle} tint={tint} />
          ) : (
            <ul className="space-y-3">
              {filteredNotes.map((note, index) => (
                <NoteListItem
                  key={index}
                  note={note}
                  tint={tint}
                  onDownloadClick={() => onDownloadClick(note, { subject: subjectTitle })}
                />
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Level section with note count.
// `id` is the anchor the subject answer blocks above the library link into.
const LevelSection = ({ id, title, icon, notes, onDownloadClick, searchTerm, tint }) => {
  // Calculate total available notes for this level
  const totalNotes = Object.values(notes).reduce((total, subjectData) => {
    return total + (Array.isArray(subjectData) ? subjectData.length : 0);
  }, 0);

  return (
    <section id={id} className="space-y-8 scroll-mt-28 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={`text-2xl sm:text-3xl font-bold ${tint.heading}`}>{title}</h2>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-full border whitespace-nowrap self-start sm:self-auto">
          {totalNotes} notes available
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(notes).map(([subjectKey, subjectData]) => {
          const subjectTitle = subjectKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          return (
            <SubjectCard
              key={subjectKey}
              subjectTitle={subjectTitle}
              subjectData={subjectData}
              onDownloadClick={(note, info) => onDownloadClick(note, { level: title, ...info })}
              searchTerm={searchTerm}
              tint={tint}
            />
          );
        })}
      </div>
    </section>
  );
};

/**
 * The interactive half of /free-notes: search, level filter, the notes grids
 * and the download form. The page's headings, subject answer blocks, FAQ and
 * schema are server-rendered in page.jsx.
 */
export default function NoteLibrary() {
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({ email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteInfo, setNoteInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPhone = localStorage.getItem("phone");
    if (savedEmail || savedPhone) {
      setFormData({ email: savedEmail || "", phone: savedPhone || "" });
    }
  }, []);

  // Analytics for the lead record. `info` already carries the level and
  // subject the reader clicked; only the year has to be read off the title.
  const noteAnalytics = (info, noteTitle) => ({
    level: info.level,
    subject: info.subject,
    year: noteTitle.match(/(\d{4})/)?.[1] ?? 'N.A.',
  });

  const handleDownloadClick = (note, info) => {
    setSelectedNote(note);
    setNoteInfo(info);
    setShowModal(true);
  };

  const validateForm = () => {
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
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("phone", formData.phone);

    try {
      const { level, subject, year } = noteAnalytics(noteInfo, selectedNote.title);

      const response = await fetch('/api/notes-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          subject,
          year,
          level,
          fileKey: selectedNote.fileKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      const result = await response.json().catch(() => ({}));

      toast.success('Thank you! Your download will begin shortly.', {
        description: "Check your email for additional study resources.",
        duration: 5000,
      });

      setShowModal(false);
      setFormErrors({});

      // Trigger the actual file download
      const url = result.downloadUrl || selectedNote?.downloadUrl;
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Something went wrong. Please try again.', {
        description: "If the problem persists, please contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const levelFilters = ["all", "primary", "secondary", "jc"];

  return (
    <>
      <div className="space-y-16">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
        <label htmlFor="note-search" className="sr-only">Search the notes library</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="note-search"
            type="text"
            placeholder="Search for specific notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-full border-gray-300 focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px]"
          />
        </div>
        </div>

        {/* Enhanced Level Filter Menu */}
        <div className="flex justify-center">
          <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-4 p-1 bg-white rounded-full h-auto shadow-sm border">
              {levelFilters.map((level) => (
                <TabsTrigger
                  key={level}
                  value={level}
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold px-4 py-3 transition-all duration-200"
                >
                  {LEVEL_LABELS[level]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Notes Sections */}
        <div className="space-y-20">
          {(selectedLevel === "all" || selectedLevel === "primary") && (
            <LevelSection
              id="notes-primary"
              title={LEVEL_LABELS.primary}
              icon={<BookOpen className={`h-8 w-8 ${LEVEL_TINTS.primary.icon}`} />}
              notes={notesData.primary || {}}
              onDownloadClick={handleDownloadClick}
              searchTerm={searchTerm}
              tint={LEVEL_TINTS.primary}
            />
          )}
          {(selectedLevel === "all" || selectedLevel === "secondary") && (
            <LevelSection
              id="notes-secondary"
              title={LEVEL_LABELS.secondary}
              icon={<GraduationCap className={`h-8 w-8 ${LEVEL_TINTS.secondary.icon}`} />}
              notes={notesData.secondary || {}}
              onDownloadClick={handleDownloadClick}
              searchTerm={searchTerm}
              tint={LEVEL_TINTS.secondary}
            />
          )}
          {(selectedLevel === "all" || selectedLevel === "jc") && (
            <LevelSection
              id="notes-jc"
              title={LEVEL_LABELS.jc}
              icon={<Atom className={`h-8 w-8 ${LEVEL_TINTS.jc.icon}`} />}
              notes={notesData.jc || {}}
              onDownloadClick={handleDownloadClick}
              searchTerm={searchTerm}
              tint={LEVEL_TINTS.jc}
            />
          )}
        </div>

        {/* Honest state of the library. A subject with no notes shows as
            "Coming soon" above rather than being counted here. */}
        <section className="text-center py-12 border-t border-gray-200 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">What&apos;s in the notes library today</h3>
          <p className="text-gray-600 max-w-xl mx-auto px-4">
            {noteCount} files, free to download: five A-Level General Paper infopacks and
            revision sets for O-Level A-Math and E-Math. Other subjects are marked
            &ldquo;Coming soon&rdquo; until real notes are ready &mdash; in the meantime the
            subject guides cover the same syllabus content.
          </p>
        </section>
      </div>

      {/* Enhanced Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Download: {selectedNote?.title}
            </DialogTitle>
            {noteInfo && (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-medium">{noteInfo.level}</span>
                  <span>→</span>
                  <span>{noteInfo.subject}</span>
                </div>
              </div>
            )}
            <DialogDescription className="text-base">
              Get instant access to these study notes by providing your contact details below. 
              We'll also keep you updated with new notes and study resources.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`h-12 ${formErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {formErrors.email && <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {formErrors.email}
              </p>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone" className="text-sm font-semibold">Contact Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="91234567"
                value={formData.phone}
                onChange={handleInputChange}
                className={`h-12 ${formErrors.phone ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {formErrors.phone && <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {formErrors.phone}
              </p>}
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-[#035C93] text-white font-semibold text-base transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Confirm & Download
                </div>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By downloading, you agree to receive educational content and updates. 
              Your information is secure and won't be shared with third parties.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}