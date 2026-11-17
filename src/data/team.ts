// The people shown in the Team section and on their own pages (/team/<slug>/).
// Add a LinkedIn address to a person and the icon appears for them.
// Only the project leads show an email address. The cards show a name, photo, email and LinkedIn only.
// A person without a photo gets a circle with their initials.
// `authorOfAi` is true for the authors of the AI 2026 paper, as printed on the paper.

export type Person = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  alternateNames?: readonly string[];
  authorOfAi?: boolean;
  corresponding?: boolean;
  // Public research profiles. Shown and marked up on the person's own page only.
  profiles?: readonly { label: string; url: string }[];
  // Affiliations as printed on the AI 2026 paper, plus any the person has given.
  affiliations?: readonly { name: string; role?: string; url?: string }[];
};

export const displayName = (p: Pick<Person, "name" | "title">): string => (p.title ? `${p.title} ${p.name}` : p.name);

export const leads: Person[] = [
  {
    id: "mariam",
    slug: "mariam-aleissa",
    name: "Mariam AlEissa",
    title: "Dr.",
    photo: "/team/mariam.jpg",
    email: "maaleissa@alfaisal.edu",
    linkedin: "https://www.linkedin.com/in/mariam-aleissa-phd-mit-ace-1767a6a1/",
    alternateNames: ["Mariam M. AlEissa"],
    authorOfAi: true,
    corresponding: true,
    affiliations: [
      { name: "College of Medicine, Alfaisal University" },
      { name: "Public Health Laboratory, Public Health Authority" },
      { name: "King Khaled Eye Specialist Hospital (KKESH) Research Center" },
      { name: "King Abdullah Petroleum Studies and Research Center (KAPSARC)" },
    ],
  },
  {
    id: "areej",
    slug: "areej-al-wabil",
    name: "Areej Al-Wabil",
    title: "Dr.",
    photo: "/team/areej.jpg",
    email: "awabil@alfaisal.edu",
    linkedin: "https://www.linkedin.com/in/alwabil/",
    alternateNames: ["Areej Alwabil"],
  },
  {
    id: "abdullah",
    slug: "abdullah-alkattan",
    name: "Abdullah N. Alkattan",
    title: "Dr.",
    photo: "/team/abdullah.jpg",
    email: "anqattan@moh.gov.sa",
    linkedin: "https://www.linkedin.com/in/abdullah-alkattan-756b27aa/",
    authorOfAi: true,
    affiliations: [{ name: "Population Health Observatory, Ministry of Health" }],
  },
];

export const members: Person[] = [
  {
    id: "siraj",
    slug: "siraj-aldeen-marghalani",
    name: "Siraj Aldeen Marghalani",
    photo: "/team/siraj.jpg",
    linkedin: "https://www.linkedin.com/in/siraj-aldeen-marghalani-b42a4a2a1/",
    authorOfAi: true,
    affiliations: [{ name: "College of Engineering and Advanced Computing, Alfaisal University" }],
  },
  {
    id: "omar",
    slug: "omar-bawazir",
    name: "Omar Bawazir",
    photo: "/team/omar.jpg",
    linkedin: "https://www.linkedin.com/in/omar-bawazir-805625309/",
    alternateNames: ["Omar Abdullah Bawazir"],
    authorOfAi: true,
    affiliations: [{ name: "College of Engineering and Advanced Computing, Alfaisal University" }],
  },
  {
    id: "hassan",
    slug: "hassan-barmandah",
    name: "Hassan Barmandah",
    photo: "/team/hassan.jpg",
    linkedin: "https://www.linkedin.com/in/hsnhb/",
    alternateNames: ["حسن برمندة"],
    authorOfAi: true,
    profiles: [
      { label: "ORCID", url: "https://orcid.org/0009-0000-3518-3693" },
      { label: "Google Scholar", url: "https://scholar.google.com/citations?user=2VzOr0kAAAAJ&hl=en" },
      { label: "ResearchGate", url: "https://www.researchgate.net/profile/Hassan-Barmandah" },
      { label: "Hugging Face", url: "https://huggingface.co/Haakkim" },
      { label: "ACL Anthology", url: "https://aclanthology.org/people/hassan-barmandah/unverified/" },
    ],
    affiliations: [
      { name: "Department of Software Engineering, Umm Al-Qura University" },
      { name: "Research and Development Club, Umm Al-Qura University (RDC UQU)", role: "Vice President", url: "https://rdcuqu.club/" },
    ],
  },
  {
    id: "muath",
    slug: "muath-shaat",
    name: "Muath Shaat",
    photo: "/team/muath.jpg",
    linkedin: "https://www.linkedin.com/in/%D9%85%D8%B9%D8%A7%D8%B0-%D8%B4%D8%B9%D8%AA-640189383/",
    authorOfAi: true,
    affiliations: [{ name: "Department of Data Science, Saudi Electronic University" }],
  },
];

export const everyone: Person[] = [...leads, ...members];
