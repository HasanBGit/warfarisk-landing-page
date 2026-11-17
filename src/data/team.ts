// The people shown in the Team section. Add a LinkedIn address to a person and the icon appears for them.
// Only the project leads show an email address. The cards show a name, photo, email and LinkedIn only.
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
    email: "maaleissa@alfaisal.edu",
    linkedin: "https://www.linkedin.com/in/mariam-aleissa-phd-mit-ace-1767a6a1/",
  },
  {
    id: "areej",
    name: "Dr. Areej Al-Wabil",
    photo: "/team/areej.jpg",
    email: "awabil@alfaisal.edu",
    linkedin: "https://www.linkedin.com/in/alwabil/",
  },
  {
    id: "abdullah",
    name: "Dr. Abdullah N. Alkattan",
    photo: "/team/abdullah.jpg",
    email: "anqattan@moh.gov.sa",
    linkedin: "https://www.linkedin.com/in/abdullah-alkattan-756b27aa/",
  },
];

export const members: Person[] = [
  { id: "siraj", name: "Siraj Aldeen Marghalani", photo: "/team/siraj.jpg", linkedin: "https://www.linkedin.com/in/siraj-aldeen-marghalani-b42a4a2a1/" },
  { id: "omar", name: "Omar Bawazir", photo: "/team/omar.jpg", linkedin: "https://www.linkedin.com/in/omar-bawazir-805625309/" },
  { id: "hassan", name: "Hassan Barmandah", photo: "/team/hassan.jpg", linkedin: "https://www.linkedin.com/in/hsnhb/" },
  { id: "muath", name: "Muath Shaat", photo: "/team/muath.jpg", linkedin: "https://www.linkedin.com/in/%D9%85%D8%B9%D8%A7%D8%B0-%D8%B4%D8%B9%D8%AA-640189383/" },
];
