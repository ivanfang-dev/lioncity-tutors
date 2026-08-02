// One hue per school level, shared by the free-notes and free-test-papers
// libraries, so a reader scanning "All Levels" can tell the sections apart.
//
// Anything carrying text — the heading, the exam-type tab, the download button —
// uses the 700 step, which clears 4.5:1 on white (4.95 / 6.83 / 7.07). Contrast
// is symmetric, so those values are equally safe as a fill behind a white label.
// The 600 step is reserved for the section icons, which are non-text and only
// need 3:1; emerald-600 is 3.22:1 and would fail behind the small "Download"
// label, which is why the tabs and buttons sit a step darker than the icons.
//
// The class strings are written out in full rather than composed from a colour
// name, because Tailwind generates utilities by scanning source text — a
// `text-${hue}-700` built at runtime would never be emitted.
export const LEVEL_TINTS = {
  primary: {
    heading: 'text-emerald-700',
    icon: 'text-emerald-600',
    tab: 'data-[state=active]:bg-emerald-700 data-[state=active]:text-white',
    action: 'text-emerald-700 hover:bg-emerald-700 hover:text-white',
    rowHover: 'hover:bg-emerald-50/40',
    placeholder: 'border-emerald-200 bg-emerald-50/30',
    placeholderIcon: 'text-emerald-400',
  },
  secondary: {
    heading: 'text-blue-700',
    icon: 'text-blue-600',
    tab: 'data-[state=active]:bg-blue-700 data-[state=active]:text-white',
    action: 'text-blue-700 hover:bg-blue-700 hover:text-white',
    rowHover: 'hover:bg-blue-50/40',
    placeholder: 'border-blue-200 bg-blue-50/30',
    placeholderIcon: 'text-blue-400',
  },
  jc: {
    heading: 'text-purple-700',
    icon: 'text-purple-600',
    tab: 'data-[state=active]:bg-purple-700 data-[state=active]:text-white',
    action: 'text-purple-700 hover:bg-purple-700 hover:text-white',
    rowHover: 'hover:bg-purple-50/40',
    placeholder: 'border-purple-200 bg-purple-50/30',
    placeholderIcon: 'text-purple-400',
  },
};
