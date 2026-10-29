// Everything about Bilal and the registry that appears as text on the site
// lives here, so it can be edited in one place without touching the pages.

export const SITE = {
  // The full name, used in page titles and link previews.
  name: "Yadik al Khair - Talent Registry",
  // The wordmark in the header, and the part after it in smaller, lighter type.
  brand: "Yadik al Khair",
  brandTail: "Talent Registry",
  // Two letters shown in the link-preview image.
  monogram: "YK",

  owner: {
    name: "Bilal Kazmi",
    firstName: "Bilal",
    // Shown in place of his photo if the photo is removed.
    initials: "BK",
    // One short line under his name (also shown on the link preview image).
    // His full LinkedIn headline is too long for this spot, so this is the
    // short version.
    headline: "HR Business Partner, Talent Development & Digital HR",
    // The sentence under the main headline on the landing page.
    intro:
      "Bilal Kazmi is an HR Business Partner with more than 18 years in financial services, fintech and technology. Add your CV to his registry and he'll have it to hand whenever a role in your field opens.",
    // "Who reads your CV" on the landing page. One paragraph per entry.
    bio: [
      "Bilal has spent more than 18 years in HR across financial services, fintech and technology, working with leadership teams on people strategy for fintech and digital banking.",
      "He builds leadership pipelines and management trainee programmes, leads digital HR and people analytics work, and champions inclusive workplaces, including opportunities for people with disabilities.",
    ],
    // Shown as tags under the bio. Taken from his LinkedIn "About" section.
    focus: [
      "Talent development",
      "Leadership pipelines",
      "Digital HR and people analytics",
      "Diversity, inclusion and accessibility",
      "Employee experience",
    ],
    linkedin: "https://www.linkedin.com/in/muhammadbillalkazmi/",
    // Optional: put a square photo in /public (for example /public/bilal.jpg)
    // and set this to "/bilal.jpg". Leave empty to show his initials.
    photo: "/bilal.jpg",
  },

  // The organisation behind the registry, shown in "About" on the landing page.
  org: {
    name: "Yadik al Khair",
    summary: [
      "Yadik al Khair is a pro bono nonprofit dedicated to spreading benevolence and providing relief to the underprivileged. Its mission is to ease the lives of all living beings through personal contributions, volunteer efforts and donations from kind-hearted people.",
      "Starting from Rawalpindi and Islamabad, Pakistan, it works on the belief that everyone deserves kindness without discrimination.",
    ],
    facts: ["Nonprofit", "Founded 2023", "Based in Islamabad"],
    links: {
      instagram: "https://instagram.com/yadik_al_khair",
      whatsapp: "https://whatsapp.com/channel/0029VasP7qPEquiXXxL5DP3V",
      linkedin: "https://www.linkedin.com/company/yadik-al-khair/",
    },
  },

  // Where candidates write to have their details corrected or removed.
  // Leave empty to point them to LinkedIn instead.
  contactEmail: "",

  // Used for link previews (LinkedIn, WhatsApp). Change it if the site moves
  // to a custom domain.
  url: "https://bk-cv-portal.vercel.app",

  description:
    "Send your CV to Bilal Kazmi once. It stays on file and is considered whenever a role in your field opens.",
} as const;

// Professions shown as quick picks on the landing page and at the top of the
// form. Each must match an entry in PROFESSIONS (src/lib/constants.ts).
export const FEATURED_DOMAINS = [
  "Information Technology",
  "Software Engineering",
  "Data & Analytics",
  "Artificial Intelligence",
  "Cybersecurity",
  "Banking & Financial Services",
  "Finance & Accounting",
  "Human Resources",
  "Sales & Business Development",
  "Marketing & Communications",
  "Project & Programme Management",
  "Customer Experience & Service",
] as const;
