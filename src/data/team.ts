// The people shown in the Team section. Add a LinkedIn address to a person and the icon appears for them.
// Only the project leads show an email address. Roles are left out where we do not have one.
// A person without a photo gets a circle with their initials.

export type Person = {
  id: string;
  name: string;
  photo?: string;
  role?: string;
  detail?: string;
  email?: string;
  linkedin?: string;
};

export const leads: Person[] = [
  {
    id: "mariam",
    name: "Dr. Mariam AlEissa",
    photo: "/team/mariam.jpg",
    role: "Project PI",
    detail: "Senior Researcher, Genetics and Innovation Consultant",
    email: "maaleissa@alfaisal.edu",
  },
  {
    id: "areej",
    name: "Dr. Areej Al-Wabil",
    photo: "/team/areej.jpg",
    role: "Project Co-PI",
    detail: "Director, AI Research Center, Alfaisal University",
    email: "awabil@alfaisal.edu",
    linkedin: "https://www.linkedin.com/in/alwabil/",
  },
  {
    id: "abdullah",
    name: "Dr. Abdullah N. Alkattan",
    photo: "/team/abdullah.jpg",
  },
];

export const members: Person[] = [
  { id: "siraj", name: "Siraj Aldeen Marghalani", photo: "/team/siraj.jpg" },
  { id: "omar", name: "Omar Bawazir", photo: "/team/omar.jpg" },
  { id: "hassan", name: "Hassan Barmandah", photo: "/team/hassan.jpg" },
  { id: "muath", name: "Muath Shaat", photo: "/team/muath.jpg" },
];
