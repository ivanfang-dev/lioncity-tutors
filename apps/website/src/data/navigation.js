export const subjects = [
  { name: "English Tuition", path: "/english-tuition" },
  { name: "Math Tuition", path: "/math-tuition" },
  { name: "Science Tuition", path: "/science-tuition" },
  { name: "Physics Tuition", path: "/physics-tuition" },
  { name: "Chemistry Tuition", path: "/chemistry-tuition" },
  { name: "Biology Tuition", path: "/biology-tuition" },
  { name: "Economics Tuition", path: "/economics-tuition" },
  { name: "Chinese Tuition", path: "/chinese-tuition" },
];

export const levels = [
  { name: "Primary School Tuition", path: "/primary-school-tuition" },
  {
    name: "Secondary School Tuition",
    path: "/secondary-school-tuition",
    submenu: [
      { name: "O Level Tuition", path: "/secondary-school-tuition/o-level-tuition" },
      { name: "N Level Tuition", path: "/secondary-school-tuition/n-level-tuition" },
    ],
  },
  { name: "Junior College Tuition", path: "/jc-tuition" },
];

export const resources = [
  { name: "Free Notes", path: "/free-notes" },
  { name: "Free Test Papers", path: "/free-test-papers" },
  { name: "Exam Guides Hub", path: "/guides/" }

];

export const forParents = [
  { name: "Request a Tutor", path: "/request-tutor" },
  { name: "Exam Guides Hub", path: "/guides" },
  { name: "Our Blog", path: "/blog" }
]

export const forTutors = [
    { name: "Become a Tutor", path: "/register-tutor" },
    { name: "Tuition Assignments", path: "/tuition-assignments" },
];