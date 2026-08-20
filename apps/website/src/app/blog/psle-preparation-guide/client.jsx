'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { X, Printer, Star, AlertTriangle, CheckCircle, BookOpen, Target, Calendar, CalendarClock, Brain, Heart, Download, HelpCircle } from 'lucide-react';
import { RelatedGuides, ExamTimetable } from '@/components/guide';
import { PSLE_FAQS } from './faqs.mjs';

const PDFModal = ({ title, children, onClose }) => (
    <>
        {/* These styles are applied only when the user tries to print */}
        <style jsx global>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                .printable-area, .printable-area * {
                    visibility: visible;
                }
                .printable-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
            }
        `}</style>

        {/* This is the on-screen, interactive modal */}
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 print:hidden">
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-background-card">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                    <CardTitle>{title}</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print / Save as PDF</Button>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 overflow-y-auto">
                    {/* The content that is shown on screen */}
                    {children}
                </CardContent>
            </Card>
        </div>

        {/* This is the hidden div that gets printed. It has the same content. */}
        <div className="hidden print:block printable-area p-8">
            {children}
        </div>
    </>
);

const WeeklyStudyPlannerPDF = () => (
    <div>
        <div className="text-center mb-6">
            <h1 className="page-title text-primary">Weekly PSLE Study Planner</h1>
            <p className="text-text-default/80 mt-2">A balanced schedule is a sustainable schedule. Adjust this based on your child's energy levels.</p>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full w-full text-sm text-left border-collapse border border-border">
                <thead className="bg-background-subtle">
                    <tr>
                        <th className="p-3 border border-border w-1/6 font-semibold">Time</th>
                        <th className="p-3 border border-border font-semibold">Monday - Thursday</th>
                        <th className="p-3 border border-border font-semibold">Friday</th>
                        <th className="p-3 border border-border font-semibold">Saturday</th>
                        <th className="p-3 border border-border font-semibold">Sunday</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-background-card"><td className="p-3 border border-border font-semibold">3:00 - 4:30 PM</td><td className="p-3 border border-border">School Homework & Rest</td><td className="p-3 border border-border">School Homework & Rest</td><td className="p-3 border border-border" rowSpan="2"><strong>Weak Subject Focus</strong><br/>(e.g., 2-hour deep dive into Math Heuristics)</td><td className="p-3 border border-border" rowSpan="2"><strong>Full Paper Practice</strong><br/>(e.g., Timed Science Paper + Review)</td></tr>
                    <tr className="bg-background-card"><td className="p-3 border border-border font-semibold">4:30 - 5:15 PM</td><td className="p-3 border border-border"><strong>Subject 1 Focus</strong> (45min)</td><td className="p-3 border border-border">Co-Curricular Activities (CCA) / Free Time</td></tr>
                    <tr className="bg-background-subtle"><td className="p-3 border border-border font-semibold">5:15 - 5:30 PM</td><td className="p-3 border border-border">Short Break (Snack)</td><td className="p-3 border border-border">Short Break</td><td className="p-3 border border-border">Lunch & Long Break</td><td className="p-3 border border-border">Lunch & Long Break</td></tr>
                    <tr className="bg-background-card"><td className="p-3 border border-border font-semibold">5:30 - 6:15 PM</td><td className="p-3 border border-border"><strong>Subject 2 Focus</strong> (45min)</td><td className="p-3 border border-border">Free Time / Hobbies</td><td className="p-3 border border-border"><strong>Revision & Review</strong><br/>(Go through mistake logbook)</td><td className="p-3 border border-border">Family Time / Outing</td></tr>
                    <tr className="bg-background-subtle"><td className="p-3 border border-border font-semibold">Night</td><td className="p-3 border border-border">Family Dinner & Downtime</td><td className="p-3 border border-border">Family Dinner & Movie Night</td><td className="p-3 border border-border">Plan for Sunday</td><td className="p-3 border border-border">Relax & Prepare for the Week</td></tr>
                </tbody>
            </table>
        </div>
    </div>
);

const MathHeuristicsChecklistPDF = () => (
    <div>
        <div className="text-center mb-6">
            <h1 className="page-title text-primary">Top 10 PSLE Math Heuristics Checklist</h1>
            <p className="text-text-default/80 mt-2">Heuristics are problem-solving tools. Mastering them is the key to unlocking difficult word problems.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
                { name: "Model Drawing", desc: "Visualizing parts and wholes for fractions and ratios." },
                { name: "Working Backwards", desc: "Starting from the end result to find the initial value." },
                { name: "Finding a Pattern", desc: "Identifying repeating sequences in numbers or figures." },
                { name: "Making a Supposition", desc: "Assuming a scenario to solve 'what if' problems." },
                { name: "Systematic Listing", desc: "Organizing all possible answers in a table to find the correct one." },
                { name: "Guess and Check", desc: "Making a logical guess and refining it based on the outcome." },
                { name: "Before-and-After Concept", desc: "Comparing quantities before and after a change." },
                { name: "Restating the Problem", desc: "Looking at the problem from a different angle." },
                { name: "Grouping Concept", desc: "Finding the value of one set or group of items." },
                { name: "Units and Parts", desc: "Using 'units' and 'parts' to solve complex ratio problems." }
            ].map(item => (
                <div key={item.name} className="flex items-start p-3 rounded-md bg-background-subtle">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-text-default">{item.name}</h4>
                        <p className="text-sm text-text-default/80">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ParentStressFreeGuidePDF = () => (
    <div>
        <div className="text-center mb-6">
            <h1 className="page-title text-primary">A Parent's Guide to a Stress-Free(er) PSLE</h1>
            <p className="text-text-default/80 mt-2">Your well-being is the foundation of your child's success. Here are tips to foster a positive environment.</p>
        </div>
        <div className="space-y-4">
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg flex items-center gap-2"><Heart className="text-accent"/> Focus on Effort, Not Outcomes</h3>
                <p className="mt-2 text-text-default/90">Praise the hard work, the persistence through a tough problem, and the discipline to stick to a schedule. This builds a resilient growth mindset that will serve them long after the PSLE. Instead of "Did you get full marks?", try asking "I saw how hard you worked on that question. What did you learn from it?"</p>
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg flex items-center gap-2"><Brain className="text-accent"/> Engineer Deliberate Downtime</h3>
                <p className="mt-2 text-text-default/90">A brain that is constantly studying is not learning efficiently. Schedule and protect time for hobbies, sports, and family activities that have nothing to do with the PSLE. This is not wasted time; it's essential recovery time that helps with memory consolidation.</p>
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg flex items-center gap-2"><CheckCircle className="text-accent"/> Be a Partner, Not a Proctor</h3>
                <p className="mt-2 text-text-default/90">Sit with them to plan their schedule. Ask collaborative questions like, "What's one thing you feel more confident about this week?" or "Which topic feels tricky right now? Let's see how we can tackle it together." This fosters teamwork, not confrontation.</p>
            </div>
        </div>
    </div>
);

const TableOfContents = () => (
  <aside className="hidden lg:block w-64 xl:w-72">
    <div className="sticky top-24 space-y-4">
      <h4 className="font-semibold text-text-default">On This Page</h4>
      <nav className="space-y-2 text-sm">
        <a href="#al-scoring" className="block text-text-default/80 hover:text-primary transition-colors">AL Scoring System</a>
        <a href="#timetable" className="block text-text-default/80 hover:text-primary transition-colors">2026 PSLE Timetable</a>
        <a href="#timeline" className="block text-text-default/80 hover:text-primary transition-colors">12-Month Timeline</a>
        <a href="#subject-strategies" className="block text-text-default/80 hover:text-primary transition-colors">Subject Strategies</a>
        <a href="#common-pitfalls" className="block text-text-default/80 hover:text-primary transition-colors">Common Pitfalls</a>
        <a href="#parents-role" className="block text-text-default/80 hover:text-primary transition-colors">A Parent's Role</a>
        <a href="#resources" className="block text-text-default/80 hover:text-primary transition-colors">Downloadable Resources</a>
        <a href="#faq" className="block text-text-default/80 hover:text-primary transition-colors">FAQs</a>
        <a href="#testimonials" className="block text-text-default/80 hover:text-primary transition-colors">Success Stories</a>
      </nav>
    </div>
  </aside>
);

const Timeline = () => (
    <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
        <div className="space-y-8">
            <div className="relative flex items-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-border bg-background-card font-bold text-primary shrink-0">1</div>
                <div className="ml-6 flex-1">
                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Phase 1: Foundation (P5 End - Mar)</CardTitle></CardHeader>
                        <CardContent><p className="text-text-default/90">This is the marathon's starting line. The focus is on building sustainable habits and a rock-solid understanding of Primary 5 concepts, which form the bedrock of the PSLE syllabus.</p></CardContent>
                    </Card>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-border bg-background-card font-bold text-primary shrink-0">2</div>
                <div className="ml-6 flex-1">
                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Phase 2: Skill Development (Apr - Jun)</CardTitle></CardHeader>
                        <CardContent><p className="text-text-default/90">The transition from learning content to applying it. This phase is about strategy, time management, and learning from mistakes systematically.</p></CardContent>
                    </Card>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-border bg-background-card font-bold text-primary shrink-0">3</div>
                <div className="ml-6 flex-1">
                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Phase 3: Mastery & Simulation (Jul - Prelims)</CardTitle></CardHeader>
                        <CardContent><p className="text-text-default/90">The final sprint. The focus shifts entirely to exam conditioning, mental resilience, and fine-tuning performance under pressure.</p></CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
);

const Resources = ({ setActivePdf }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="flex items-center gap-2"><Calendar className="text-primary" /> Weekly Study Planner</CardTitle>
        <CardDescription>A customizable template to balance study, breaks, and family time.</CardDescription>
      </CardHeader>
      <CardContent>
          <Button className="w-full bg-primary text-text-inverse hover:bg-primary/90" onClick={() => setActivePdf('planner')}>
            <Download className="mr-2 h-4 w-4" /> View & Print PDF
          </Button>
      </CardContent>
    </Card>
    <Card className="hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary" /> Math Heuristics Checklist</CardTitle>
        <CardDescription>A checklist of the top 10 problem-solving heuristics for PSLE Math.</CardDescription>
      </CardHeader>
      <CardContent>
          <Button className="w-full bg-primary text-text-inverse hover:bg-primary/90" onClick={() => setActivePdf('heuristics')}>
            <Download className="mr-2 h-4 w-4" /> View & Print PDF
          </Button>
      </CardContent>
    </Card>
    <Card className="hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="flex items-center gap-2"><Heart className="text-primary" /> Parent's Stress-Free Guide</CardTitle>
        <CardDescription>Actionable tips for managing your child's (and your own) anxiety.</CardDescription>
      </CardHeader>
      <CardContent>
          <Button variant="outline" className="w-full bg-primary text-text-inverse hover:bg-primary/90" onClick={() => setActivePdf('guide')}>
            <Download className="mr-2 h-4 w-4" /> View & Print PDF
          </Button>
      </CardContent>
    </Card>
  </div>
);

const Testimonials = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-background-subtle text-primary flex items-center justify-center font-bold text-xl mr-4">MT</div>
          <div>
            <p className="font-bold">Mdm. Tan</p>
            <p className="text-sm text-text-default/70">Parent of Ethan, P6</p>
          </div>
        </div>
        <p className="text-text-default/90 italic">"Tutor Daniel didn't just teach my son Math, he taught him how to think logically. He broke down complex heuristics into simple steps. Ethan's confidence and his results shot up from an AL6 to a solid AL4 in just four months."</p>
      </Card>
      <Card className="p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-background-subtle text-primary flex items-center justify-center font-bold text-xl mr-4">SL</div>
          <div>
            <p className="font-bold">Mr. Lim</p>
            <p className="text-sm text-text-default/70">Parent of Chloe, P6</p>
          </div>
        </div>
        <p className="text-text-default/90 italic">"The biggest change was in Science. Our tutor helped Chloe master the keyword precision needed for Section B. She learned how to structure her answers perfectly and stopped losing careless marks. We are so grateful for the targeted help."</p>
      </Card>
    </div>
);

// Main Page Component
export default function PSLEPreparationGuideClient() {
  const [activePdf, setActivePdf] = useState(null);

    const renderPdfContent = () => {
        if (!activePdf) return null;
        const pdfs = {
            planner: { title: "Weekly Study Planner", content: <WeeklyStudyPlannerPDF /> },
            heuristics: { title: "Math Heuristics Checklist", content: <MathHeuristicsChecklistPDF /> },
            guide: { title: "Parent's Stress-Free Guide", content: <ParentStressFreeGuidePDF /> },
        };
        const { title, content } = pdfs[activePdf];
        return <PDFModal title={title} onClose={() => setActivePdf(null)}>{content}</PDFModal>;
    };

  return (
    <div className="bg-background-default text-text-default">
      {renderPdfContent()}
      <header className="bg-background-card border-b">
        <div className="container mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="page-title text-primary">
            The Ultimate Parent’s Guide to PSLE Preparation (2026)
          </h1>
          <p className="mt-4 text-lg md:text-xl text-text-default/80 max-w-3xl mx-auto">
            A complete, strategic roadmap to navigate the syllabus, support your child emotionally, and unlock their full potential for the PSLE.
          </p>
          <div className="mt-8">
            <Link href="#final-cta">
              <Button size="lg" className="bg-accent-fill text-text-inverse hover:bg-accent-fill-hover shadow-lg transform hover:scale-105 transition-transform">
                Get Expert PSLE Support Today
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 xl:gap-16">
        <TableOfContents />

        <main className="flex-1 min-w-0">
          <article className="space-y-16">
            
            <section id="al-scoring">
              <h2 className="section-title text-primary mb-6 border-l-4 border-primary pl-4">Decoding the PSLE Format & AL Scoring</h2>
              <p className="mb-6 text-lg">
                Since 2021, the PSLE has used the Achievement Level (AL) system to reduce the fine differentiation of students by T-score. This system encourages students to focus on their own mastery of subjects rather than competing with their peers. Your child’s final PSLE Score is the sum of their ALs across the four main subjects.
              </p>
              <Card className="shadow-xl bg-background-card">
                <CardHeader>
                  <CardTitle>PSLE Achievement Level (AL) Score Bands</CardTitle>
                  <CardDescription>Understanding these bands is key to setting realistic and strategic academic targets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-background-subtle text-text-default">
                        <tr>
                          <th className="p-4 font-semibold rounded-tl-lg">AL</th>
                          <th className="p-4 font-semibold">Raw Mark Range</th>
                          <th className="p-4 font-semibold rounded-tr-lg">Interpretation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { al: 1, range: '≥ 90', interp: 'Excellent Mastery' },
                          { al: 2, range: '85 - 89', interp: 'Very High Competence' },
                          { al: 3, range: '80 - 84', interp: 'High Competence' },
                          { al: 4, range: '75 - 79', interp: 'Competent' },
                          { al: 5, range: '65 - 74', interp: 'Good Foundation' },
                          { al: 6, range: '45 - 64', interp: 'Foundation Level (Critical 20-mark band)' },
                          { al: 7, range: '20 - 44', interp: 'Needs Development' },
                          { al: 8, range: '< 20', interp: 'Needs Significant Development' },
                        ].map(({ al, range, interp }, index) => (
                          <tr key={al} className={`border-b border-border ${index % 2 === 0 ? 'bg-background-card' : 'bg-background-subtle'}`}>
                            <td className="p-4 font-bold text-primary">{al}</td>
                            <td className="p-4">{range}</td>
                            <td className="p-4">{interp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg">
                    <p><strong>Strategic Insight:</strong> The 20-mark range for AL6 is a critical battleground. Consistent practice can help a child move from a potential AL6 to a solid AL5, significantly improving their overall PSLE score and secondary school options.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="timetable">
              <h2 className="section-title text-primary mb-6 border-l-4 border-primary pl-4 flex items-center"><CalendarClock className="mr-3 h-8 w-8 text-primary shrink-0" />When is the PSLE in 2026?</h2>
              <p className="mb-6 text-lg">
                {PSLE_FAQS[0].answer}
              </p>
              <Card className="shadow-md bg-background-card">
                <CardContent className="pt-6">
                  <ExamTimetable examSlug="psle" caption="Official 2026 PSLE timetable, as published by SEAB." />
                </CardContent>
              </Card>
            </section>

            <section id="timeline">
              <h2 className="section-title text-primary mb-8 border-l-4 border-primary pl-4">The 12-Month PSLE Preparation Timeline</h2>
              <Timeline />
            </section>

            <section id="subject-strategies" className="space-y-8">
              <h2 className="section-title text-primary mb-6 border-l-4 border-primary pl-4">Subject-Specific Strategies</h2>
              
              <Card>
                  <CardHeader>
                      <CardTitle>📚 English Language: Beyond Grammar</CardTitle>
                      <CardDescription>Success requires moving from passive reading to active analysis and nuanced expression.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <h4 className="font-semibold">Composition (Paper 1):</h4>
                          <p className="text-sm">Develop a 'Show, Don't Tell' mindset. Instead of 'He was angry', write 'He clenched his fists, his jaw tightening as a vein throbbed on his temple.' This creates a vivid picture for the examiner.</p>
                      </div>
                      <div>
                          <h4 className="font-semibold">Oral Communication (PAC):</h4>
                          <p className="text-sm">Master the PAC (Purpose, Audience, Context) framework for the visual stimulus section. Teach your child to ask: "What is this poster trying to achieve? Who is it for? Where would I see it?"</p>
                      </div>
                      <div className="pt-2">
                        <Link href="/psle-english" className="text-sm font-semibold text-primary hover:underline">
                          Go to the Complete PSLE English Guide &rarr;
                        </Link>
                      </div>
                  </CardContent>
              </Card>
              
              <Card>
                  <CardHeader>
                      <CardTitle>🔢 Mathematics: The Art of Heuristics</CardTitle>
                      <CardDescription>PSLE Math is a test of logic. Students must know which problem-solving tool to use and when.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <h4 className="font-semibold">Heuristics Mastery:</h4>
                          <p className="text-sm">Go beyond basic Model Drawing. Introduce advanced heuristics like 'Working Backwards', 'Finding a Pattern', and 'Making a Supposition' for complex, multi-step problems.</p>
                      </div>
                      <div>
                          <h4 className="font-semibold">Systematic Error Analysis:</h4>
                          <p className="text-sm">Categorize mistakes after every practice paper. Are they due to: 1) Calculation error, 2) Concept misunderstanding, or 3) Misinterpretation of the question? This reveals the true weak spot.</p>
                      </div>
                       <div className="pt-2">
                        <Link href="/psle-math" className="text-sm font-semibold text-primary hover:underline">
                          Master Heuristics with the PSLE Math Guide &rarr;
                        </Link>
                      </div>
                  </CardContent>
              </Card>
              
               <Card>
                  <CardHeader>
                      <CardTitle>🔬 Science: Thinking Like a Scientist</CardTitle>
                      <CardDescription>Success hinges on mastering keywords and applying concepts to unfamiliar scenarios.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <h4 className="font-semibold">Keyword Precision for Section B:</h4>
                          <p className="text-sm">For open-ended questions, using scientific keywords (e.g., 'photosynthesis', 'condensation', 'friction') is non-negotiable. Create flashcards specifically for these keywords and their definitions.</p>
                      </div>
                      <div>
                          <h4 className="font-semibold">The C-U-E Answering Framework:</h4>
                          <p className="text-sm">Teach the C-U-E method for application questions: C (Concept) - identify the core science concept. U (Use) - use data/details from the question. E (Explain) - link the concept and data to explain the outcome.</p>
                      </div>
                       <div className="pt-2">
                        <Link href="/psle-science" className="text-sm font-semibold text-primary hover:underline">
                          See the Full PSLE Science Syllabus Breakdown &rarr;
                        </Link>
                      </div>
                  </CardContent>
              </Card>

               <Card>
                  <CardHeader>
                      <CardTitle>🏛️ Mother Tongue (Chinese): Key Components</CardTitle>
                      <CardDescription>Fluency is built through consistent exposure and targeted practice of exam components.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <h4 className="font-semibold">Oral Exam (Conversation):</h4>
                          <p className="text-sm">Expand beyond textbook topics. Discuss current affairs suitable for their age, watch news clips in Chinese, and encourage them to form and express their opinions on these topics.</p>
                      </div>
                      <div>
                          <h4 className="font-semibold">Comprehension (理解问答):</h4>
                          <p className="text-sm">This section often tests for deeper, inferential understanding (深层含义). Practice identifying subtle clues in the text and understanding the author's hidden intent or emotions.</p>
                      </div>
                       <div className="pt-2">
                        <Link href="/psle-chinese" className="text-sm font-semibold text-primary hover:underline">
                          Read the In-Depth PSLE Chinese Guide &rarr;
                        </Link>
                      </div>
                  </CardContent>
              </Card>
            </section>
            
            <section id="common-pitfalls">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-6 rounded-r-lg shadow-lg">
                <h2 className="section-title text-primary flex items-center mb-4"><AlertTriangle className="mr-3" />Top 5 PSLE Pitfalls to Avoid</h2>
                <ol className="list-decimal list-inside space-y-3">
                  <li><strong>Neglecting Paper 1 for 'Harder' Papers:</strong> Forgetting that Paper 1 (e.g., MCQ in Math/Science) is crucial for securing a good grade. Speed and accuracy here are easy wins often overlooked.</li>
                  <li><strong>Memorizing Without Understanding:</strong> Especially in Science, memorizing answers from past papers fails when question scenarios are changed. Focus on the 'why' behind the concept.</li>
                  <li><strong>Poor Time Allocation:</strong> Spending 20 minutes on a 3-mark question is a common mistake. Teach your child to be a ruthless time manager, moving on from difficult questions.</li>
                  <li><strong>Ignoring Weaker Subjects:</strong> Under the AL system, every subject is equally important. Pulling an AL6 up to a 5 has the same impact as keeping an AL1.</li>
                  <li><strong>Parental Burnout Transfer:</strong> Your anxiety is contagious. A structured plan with breaks is far more effective for your child than relentless, unstructured studying driven by stress.</li>
                </ol>
              </div>
            </section>
            
            <section id="parents-role">
              <h2 className="section-title text-primary mb-8 border-l-4 border-primary pl-4">A Parent’s Role: Beyond Academics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex items-start p-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-4 shrink-0" />
                    <div>
                        <h4 className="font-bold">Focus on Effort, Not Grades</h4>
                        <p className="text-sm text-text-default/80">Praise the hard work and persistence. This builds a resilient growth mindset that will serve them long after the PSLE.</p>
                    </div>
                </Card>
                 <Card className="flex items-start p-6">
                    <Heart className="h-8 w-8 text-red-500 mr-4 shrink-0" />
                    <div>
                        <h4 className="font-bold">Be the Emotional Anchor</h4>
                        <p className="text-sm text-text-default/80">Your child needs a calm harbor. Manage your own anxiety and project confidence in their ability to handle the challenge.</p>
                    </div>
                </Card>
                 <Card className="flex items-start p-6">
                    <Brain className="h-8 w-8 text-purple-500 mr-4 shrink-0" />
                    <div>
                        <h4 className="font-bold">Engineer Downtime</h4>
                        <p className="text-sm text-text-default/80">A brain that is constantly studying is not learning efficiently. Schedule protected time for hobbies, sports, and family fun.</p>
                    </div>
                </Card>
                 <Card className="flex items-start p-6">
                    <Target className="h-8 w-8 text-blue-500 mr-4 shrink-0" />
                    <div>
                        <h4 className="font-bold">Partner, Not Proctor</h4>
                        <p className="text-sm text-text-default/80">Sit with them to plan their schedule. Ask collaborative questions like, "What topic feels tricky right now?"</p>
                    </div>
                </Card>
              </div>
            </section>
            
            <section id="resources">
              <h2 className="section-title text-primary mb-8 border-l-4 border-primary pl-4">Downloadable Resources</h2>
              <Resources setActivePdf={setActivePdf} />
            </section>

            <RelatedGuides slug="psle-prep" heading="In-depth PSLE subject guides" showHub={false} limit={20} />

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><HelpCircle className="mr-3 h-8 w-8 text-primary shrink-0" />Frequently Asked Questions</h2>
              <div className="space-y-6">
                {PSLE_FAQS.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-xl font-semibold text-text-default">{faq.question}</h3>
                    <p className="mt-2 text-text-default/80">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="testimonials">
              <h2 className="section-title text-primary mb-8 border-l-4 border-primary pl-4">Success Stories</h2>
              <Testimonials />
            </section>

            <section id="final-cta">
              <div className="bg-background-card rounded-lg shadow-2xl p-8 md:p-12 text-center">
                <h2 className="section-title text-primary">Ready to Give Your Child the PSLE Advantage?</h2>
                <p className="mt-4 text-text-default/80 max-w-2xl mx-auto">
                  If your child is struggling with specific topics, lacking confidence, or if you need expert guidance navigating the syllabus, a specialist PSLE tutor can make all the difference.
                </p>
                <blockquote className="mt-6 border-l-4 border-border pl-4 italic text-text-default/90 text-left max-w-xl mx-auto">
                  "Our tutor transformed my daughter's attitude towards learning. She went from dreading Science to actively participating. It wasn't just about grades; it was about finding joy in the process."
                </blockquote>
                <div className="mt-8">
                   <Link href="/request-tutor">
                    <Button size="lg" className="text-xl bg-accent-fill text-text-inverse hover:bg-accent-fill-hover">
                      Request a Specialist Tutor
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

          </article>
        </main>
      </div>
    </div>
  );
}