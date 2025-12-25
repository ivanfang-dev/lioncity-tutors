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
import { Download, BookOpen, GraduationCap, Atom, FileText, Search, Clock, Lightbulb } from "lucide-react";
import { notesData } from "../../data/notesData"; 

// Coming Soon Component for empty arrays
const ComingSoonCard = ({ level, colorScheme = "indigo" }) => (
  <div className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-colors ${
    colorScheme === 'emerald'
      ? 'border-emerald-200 bg-emerald-50/30'
      : colorScheme === 'blue'
      ? 'border-blue-200 bg-blue-50/30'
      : colorScheme === 'purple'
      ? 'border-purple-200 bg-purple-50/30'
      : 'border-indigo-200 bg-indigo-50/30'
  }`}>
    <Clock className={`h-8 w-8 mb-3 ${
      colorScheme === 'emerald'
        ? 'text-emerald-400'
        : colorScheme === 'blue'
        ? 'text-blue-400'
        : colorScheme === 'purple'
        ? 'text-purple-400'
        : 'text-indigo-400'
    }`} />
    <p className="text-gray-500 font-medium text-center">
      Coming Soon
    </p>
    <p className="text-gray-400 text-sm text-center mt-1">
      {level} notes will be available soon
    </p>
  </div>
);

// Enhanced Note list item with better spacing and responsive design
const NoteListItem = ({ note, onDownloadClick, colorScheme = "indigo" }) => (
  <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md hover:bg-indigo-50/40 transition-all duration-200">
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
      className={`flex items-center gap-2 transition-colors duration-200 flex-shrink-0 w-full sm:w-auto justify-center ${
        colorScheme === 'emerald'
          ? 'text-emerald-600 hover:bg-emerald-600 hover:text-white'
          : colorScheme === 'blue'
          ? 'text-blue-600 hover:bg-blue-600 hover:text-white'
          : colorScheme === 'purple'
          ? 'text-purple-600 hover:bg-purple-600 hover:text-white'
          : 'text-indigo-600 hover:bg-indigo-600 hover:text-white'
      }`}
      onClick={onDownloadClick}
      aria-label={`Download ${note.title}`}
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  </li>
);

// Subject card with search functionality and coming soon support
const SubjectCard = ({ subjectTitle, subjectData, onDownloadClick, searchTerm, colorScheme = "indigo" }) => {
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
            <ComingSoonCard level={subjectTitle} colorScheme={colorScheme} />
          ) : (
            <ul className="space-y-3">
              {filteredNotes.map((note, index) => (
                <NoteListItem
                  key={index}
                  note={note}
                  colorScheme={colorScheme}
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

// Level section with note count
const LevelSection = ({ title, icon, notes, onDownloadClick, colorClass, searchTerm, colorScheme = "indigo" }) => {
  // Calculate total available notes for this level
  const totalNotes = Object.values(notes).reduce((total, subjectData) => {
    return total + (Array.isArray(subjectData) ? subjectData.length : 0);
  }, 0);

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={`text-2xl sm:text-3xl font-bold ${colorClass}`}>{title}</h2>
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
              colorScheme={colorScheme}
            />
          );
        })}
      </div>
    </section>
  );
};

export default function FreeNotes() {
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

  // Function to extract analytics from notes path and title
  const extractNoteInfo = (notePath, noteTitle) => {
    const pathParts = notePath.split('.');
    const level = pathParts[0];
    const subject = pathParts[2];

    // Extract year from title if available, otherwise default
    const yearMatch = noteTitle.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : 'N.A.';

    return { level, subject, year };
  };

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
      // Extract analytics info
      const { level, subject, year } = extractNoteInfo(noteInfo.level, selectedNote.title);

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
          level
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      toast.success('Thank you! Your download will begin shortly.', {
        description: "Check your email for additional study resources.",
        duration: 5000,
      });
      
      setShowModal(false);
      setFormErrors({});

      // Trigger the actual file download
      if (selectedNote?.downloadUrl) {
        window.open(selectedNote.downloadUrl, '_blank');
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
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-16">
          {/* Enhanced Hero Section */}
          <section className="text-center py-8 space-y-6">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Lightbulb className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Free Study Notes
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Access our comprehensive collection of study notes from top Singapore schools. 
              Enhance your understanding with quality revision materials and boost your academic performance.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for specific notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Enhanced Level Filter Menu */}
          <div className="sticky top-4 z-10 flex justify-center backdrop-blur-sm">
            <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full max-w-2xl">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-white/90 backdrop-blur-sm rounded-full h-auto shadow-lg border">
                {levelFilters.map((level) => (
                  <TabsTrigger
                    key={level}
                    value={level}
                    className="rounded-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-4 py-3 transition-all duration-200"
                  >
                    {level === "jc" ? "JC" : level.charAt(0).toUpperCase() + level.slice(1)}
                    {level === "all" && " Levels"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Notes Sections */}
          <div className="space-y-20">
            {(selectedLevel === "all" || selectedLevel === "primary") && (
              <LevelSection
                title="Primary School"
                icon={<BookOpen className="h-8 w-8 text-emerald-600" />}
                notes={notesData.primary || {}}
                onDownloadClick={handleDownloadClick}
                colorClass="text-emerald-700"
                searchTerm={searchTerm}
                colorScheme="emerald"
              />
            )}
            {(selectedLevel === "all" || selectedLevel === "secondary") && (
              <LevelSection
                title="Secondary School"
                icon={<GraduationCap className="h-8 w-8 text-blue-600" />}
                notes={notesData.secondary || {}}
                onDownloadClick={handleDownloadClick}
                colorClass="text-blue-700"
                searchTerm={searchTerm}
                colorScheme="blue"
              />
            )}
            {(selectedLevel === "all" || selectedLevel === "jc") && (
              <LevelSection
                title="Junior College (A-Level)"
                icon={<Atom className="h-8 w-8 text-purple-600" />}
                notes={notesData.jc || {}}
                onDownloadClick={handleDownloadClick}
                colorClass="text-purple-700"
                searchTerm={searchTerm}
                colorScheme="purple"
              />
            )}
          </div>

          {/* Enhanced Footer with Statistics */}
          <section className="text-center py-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Empowering Student Success</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">200+</div>
                <div className="text-gray-600">Notes Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">30+</div>
                <div className="text-gray-600">Top Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">5k+</div>
                <div className="text-gray-600">Downloads</div>
              </div>
            </div>
          </section>
        </div>
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
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
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
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors duration-200"
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