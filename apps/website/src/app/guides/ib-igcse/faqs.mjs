/**
 * FAQ content for the IB & IGCSE hub. Rendered as visible text AND emitted as
 * FAQPage JSON-LD — both read from here so the two can never drift.
 *
 * These six subject pages were orphaned before this cluster existed: no hub, no
 * inbound internal links. Two already rank without any help (/ibdp-physics at
 * position 11.0, /igcse-chemistry at 12.8).
 *
 * Sourcing note: IB and IGCSE are run by the IB Organization and Cambridge
 * International respectively, not SEAB, so no SEAB primary source applies here.
 * Nothing below states a mark scheme, grade boundary or exam date — only
 * structural facts that are stable and publicly documented by those boards.
 */
export const IB_IGCSE_FAQS = [
  {
    question: 'What is the difference between IB and A-Level in Singapore?',
    answer:
      'The IB Diploma requires six subjects across disciplines plus an extended essay and theory of knowledge, graded out of 45. The Singapore A-Level lets students specialise earlier in three or four H2 subjects with General Paper. IB rewards breadth; A-Level rewards depth.',
  },
  {
    question: 'Should I take HL or SL for a subject?',
    answer:
      'Higher Level covers more content in greater depth and carries heavier assessment; Standard Level covers the core. Take HL in subjects a target university course requires, and in subjects you are genuinely strong at. Three HL and three SL is the standard Diploma combination.',
  },
  {
    question: 'Is IGCSE harder than O-Level?',
    answer:
      'They are different rather than strictly harder. IGCSE is offered by Cambridge International with core and extended tiers, while the O-Level is the Singapore-Cambridge national examination. IGCSE assessment often includes more coursework and practical components; the O-Level leans more heavily on terminal written papers.',
  },
  {
    question: 'Do Singapore universities accept IB and IGCSE?',
    answer:
      'Yes. NUS, NTU and SMU all admit students holding the IB Diploma alongside A-Level holders, assessing them on their own scale. IGCSE is a pre-university qualification, so it feeds into A-Level, IB Diploma or a polytechnic route rather than being used for direct university admission.',
  },
];
