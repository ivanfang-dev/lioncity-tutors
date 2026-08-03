"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, BookOpen, GraduationCap, Atom, FileText, Search, Clock } from "lucide-react";
import { testPapers } from "../../data/testPapers.mjs";
import { LEVEL_TINTS } from "@/lib/levelTints";
import { paperStats } from "./stats";

// Coming Soon Component for empty arrays
const ComingSoonCard = ({ examType, tint }) => (
  <div className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-colors ${tint.placeholder}`}>
    <Clock className={`h-8 w-8 mb-3 ${tint.placeholderIcon}`} />
    <p className="text-gray-500 font-medium text-center">
      Coming Soon
    </p>
    <p className="text-gray-400 text-sm text-center mt-1">
      {examType.replace(/_/g, ' ').toUpperCase()} papers will be available soon
    </p>
  </div>
);

// ✅ Improved Paper list item with better spacing and responsive design
const PaperListItem = ({ paper, onDownloadClick, tint }) => (
  <li className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all duration-200 ${tint.rowHover}`}>
    <div className="flex items-start gap-3 min-w-0 flex-1">
      <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="font-medium text-gray-800 text-sm sm:text-base leading-tight block">
          {paper.title}
        </span>
        {paper.description && (
          <span className="text-xs text-gray-500 mt-1 block">{paper.description}</span>
        )}
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 transition-colors duration-200 flex-shrink-0 w-full sm:w-auto justify-center ${tint.action}`}
      onClick={onDownloadClick}
      aria-label={`Download ${paper.title}`}
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  </li>
);

// Subject card with search functionality and coming soon support
const SubjectCard = ({ subjectTitle, subjectData, onDownloadClick, searchTerm, tint }) => {
  const hasExamTypes =
    typeof subjectData === "object" && !Array.isArray(subjectData) && Object.keys(subjectData).length > 0;
  const examTypes = hasExamTypes ? Object.keys(subjectData) : [];

  // Filter papers based on search term
  const filterPapers = (papers) => {
    if (!searchTerm) return papers;
    return papers.filter(paper => 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Check if subject has any papers matching search
  const hasMatchingPapers = () => {
    if (hasExamTypes) {
      return examTypes.some(type => 
        Array.isArray(subjectData[type]) ? filterPapers(subjectData[type]).length > 0 : 
        Object.values(subjectData[type] || {}).some(papers => filterPapers(papers).length > 0)
      );
    } else {
      return Array.isArray(subjectData) && filterPapers(subjectData).length > 0;
    }
  };

  // Calculate total available papers (excluding empty arrays)
  const totalAvailablePapers = () => {
    if (hasExamTypes) {
      return examTypes.reduce((total, type) => {
        if (Array.isArray(subjectData[type])) {
          return total + subjectData[type].length;
        } else if (typeof subjectData[type] === 'object') {
          return total + Object.values(subjectData[type] || {}).reduce((subTotal, papers) => {
            return subTotal + (Array.isArray(papers) ? papers.length : 0);
          }, 0);
        }
        return total;
      }, 0);
    } else {
      return Array.isArray(subjectData) ? subjectData.length : 0;
    }
  };

  if (searchTerm && !hasMatchingPapers()) {
    return null; // Hide card if no matching papers
  }

  const availablePapers = totalAvailablePapers();

  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out rounded-2xl overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h4 className="font-bold text-xl text-gray-900">{subjectTitle}</h4>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-auto">
            {availablePapers} papers available
          </div>
        </div>
        
        {hasExamTypes ? (
          <Tabs defaultValue={examTypes[0]} className="w-full">
            <TabsList className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg w-full">
              {examTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${tint.tab}`}
                >
                  {type.replace(/_/g, ' ').toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
            {examTypes.map((type) => (
              <TabsContent key={type} value={type} className="mt-4">
                {Array.isArray(subjectData[type]) ? (
                  subjectData[type].length === 0 ? (
                    <ComingSoonCard examType={type} tint={tint} />
                  ) : (
                    <ul className="space-y-3">
                      {filterPapers(subjectData[type]).map((paper, index) => (
                        <PaperListItem
                          key={index}
                          paper={paper}
                          tint={tint}
                          onDownloadClick={() =>
                            onDownloadClick(paper, { subject: subjectTitle, examType: type })
                          }
                        />
                      ))}
                    </ul>
                  )
                ) : (
                  <div className="space-y-4">
                    {Object.entries(subjectData[type] || {}).map(([subType, papers]) => (
                      <div key={subType} className="space-y-2">
                        <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {subType.replace(/_/g, ' ')}
                        </h5>
                        {Array.isArray(papers) && papers.length === 0 ? (
                          <ComingSoonCard examType={`${type} ${subType}`} tint={tint} />
                        ) : (
                          <ul className="space-y-3">
                            {filterPapers(papers).map((paper, index) => (
                              <PaperListItem
                                key={index}
                                paper={paper}
                                tint={tint}
                                onDownloadClick={() =>
                                  onDownloadClick(paper, { subject: subjectTitle, examType: `${type} - ${subType}` })
                                }
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div>
            {Array.isArray(subjectData) && subjectData.length === 0 ? (
              <ComingSoonCard examType="papers" tint={tint} />
            ) : (
              <ul className="space-y-3">
                {Array.isArray(subjectData) &&
                  filterPapers(subjectData).map((paper, index) => (
                    <PaperListItem
                      key={index}
                      paper={paper}
                      tint={tint}
                      onDownloadClick={() => onDownloadClick(paper, { subject: subjectTitle })}
                    />
                  ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Level section with paper count (only counting available papers).
// `id` is the anchor the level answer blocks above the library link into.
const LevelSection = ({ id, title, icon, papers, onDownloadClick, searchTerm, tint }) => {
  // Calculate total available papers for this level (excluding empty arrays)
  const totalPapers = Object.values(papers).reduce((total, subjectData) => {
    if (Array.isArray(subjectData)) {
      return total + subjectData.length;
    } else if (typeof subjectData === 'object') {
      return total + Object.values(subjectData).reduce((subTotal, typeData) => {
        if (Array.isArray(typeData)) {
          return subTotal + typeData.length;
        } else if (typeof typeData === 'object') {
          return subTotal + Object.values(typeData).reduce((deepTotal, papers) => {
            return deepTotal + (Array.isArray(papers) ? papers.length : 0);
          }, 0);
        }
        return subTotal;
      }, 0);
    }
    return total;
  }, 0);

  return (
    <section id={id} className="space-y-8 scroll-mt-28 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={`text-2xl sm:text-3xl font-bold ${tint.heading}`}>{title}</h2>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-full border whitespace-nowrap self-start sm:self-auto">
          {totalPapers} papers available
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(papers).map(([subjectKey, subjectData]) => {
          const subjectTitle = subjectKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          return (
            <SubjectCard
              key={subjectKey}
              subjectTitle={subjectTitle}
              subjectData={subjectData}
              onDownloadClick={(paper, info) => onDownloadClick(paper, { level: title, ...info })}
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
 * The interactive half of /free-test-papers: search, level filter, the paper
 * grids and the download form. The page's headings, level answer blocks, FAQ
 * and schema are server-rendered in page.jsx.
 */
export default function PaperLibrary() {
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({ email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [paperInfo, setPaperInfo] = useState(null);
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

  const handleDownloadClick = (paper, info) => {
    setSelectedPaper(paper);
    setPaperInfo(info);
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
      const response = await fetch("/api/test-paper-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          level: paperInfo.level,
          subject: paperInfo.subject,
          paperTitle: selectedPaper.title,
          fileKey: selectedPaper.fileKey,
        }),
      });

      if (!response.ok) throw new Error("API submission failed");
      const result = await response.json().catch(() => ({}));

      toast.success("Thank you! Your download will begin shortly.", {
        description: "Check your email for additional study resources.",
        duration: 5000,
      });

      setShowModal(false);
      setFormErrors({});

      const url = result.downloadUrl || selectedPaper?.downloadUrl;
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.", {
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
          <label htmlFor="paper-search" className="sr-only">Search the paper library</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="paper-search"
              type="text"
              placeholder="Search for specific papers..."
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
                  {level === "jc" ? "JC" : level.charAt(0).toUpperCase() + level.slice(1)}
                  {level === "all" && " Levels"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Test Papers Sections */}
        <div className="space-y-20">
          {(selectedLevel === "all" || selectedLevel === "primary") && (
            <LevelSection
              id="papers-primary"
              title="Primary School"
              icon={<BookOpen className={`h-8 w-8 ${LEVEL_TINTS.primary.icon}`} />}
              papers={testPapers.primary}
              onDownloadClick={handleDownloadClick}
              searchTerm={searchTerm}
              tint={LEVEL_TINTS.primary}
            />
          )}
          {(selectedLevel === "all" || selectedLevel === "secondary") && (
            <LevelSection
              id="papers-secondary"
              title="Secondary School"
              icon={<GraduationCap className={`h-8 w-8 ${LEVEL_TINTS.secondary.icon}`} />}
              papers={testPapers.secondary}
              onDownloadClick={handleDownloadClick}
              searchTerm={searchTerm}
              tint={LEVEL_TINTS.secondary}
            />
          )}
          {(selectedLevel === "all" || selectedLevel === "jc") && (
            <LevelSection
              id="papers-jc"
              title="Junior College (A-Level)"
              icon={<Atom className={`h-8 w-8 ${LEVEL_TINTS.jc.icon}`} />}
              papers={testPapers.jc}
              onDownloadClick={handleDownloadClick}
              searchTerm={searchTerm}
              tint={LEVEL_TINTS.jc}
            />
          )}
        </div>

        {/* What's in the library — every figure counted from testPapers.js */}
        <section className="text-center py-16 border-t border-gray-200 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s in the library today</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary tabular-nums">{paperStats.total}</div>
              <div className="text-gray-600">Papers to download</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary tabular-nums">{paperStats.subjects}</div>
              <div className="text-gray-600">Subjects covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary tabular-nums">
                {paperStats.firstYear}&ndash;{paperStats.lastYear}
              </div>
              <div className="text-gray-600">Exam years</div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Download: {selectedPaper?.title}
            </DialogTitle>
            {paperInfo && (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-medium">{paperInfo.level}</span>
                  <span>→</span>
                  <span>{paperInfo.subject}</span>
                  {paperInfo.examType && (
                    <>
                      <span>→</span>
                      <span className="capitalize">{paperInfo.examType.toUpperCase()}</span>
                    </>
                  )}
                </div>
              </div>
            )}
            <DialogDescription className="text-base">
              Get instant access to this exam paper by providing your contact details below. 
              We'll also keep you updated with new papers and study resources.
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