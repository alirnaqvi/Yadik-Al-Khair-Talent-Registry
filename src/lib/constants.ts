// The lists below drive both the candidate form and the admin filters, so a
// value picked on the form is always one BK can filter on. Edit them here.

// Profession / field. This is BK's list, in his order. "Other" sits at the end
// so nobody is forced into a wrong category.
export const PROFESSIONS = [
  "Information Technology",
  "Software Engineering",
  "Data & Analytics",
  "Artificial Intelligence",
  "Cybersecurity",
  "Banking & Financial Services",
  "Finance & Accounting",
  "Audit, Risk & Compliance",
  "Human Resources",
  "Sales & Business Development",
  "Marketing & Communications",
  "Customer Experience & Service",
  "Business Operations & Administration",
  "Project & Programme Management",
  "Product Management",
  "Strategy & Consulting",
  "Digital Transformation & Automation",
  "Engineering & Technical Services",
  "Manufacturing & Production",
  "Supply Chain & Logistics",
  "Quality Assurance",
  "Research & Development",
  "Legal Services",
  "Healthcare & Medical Services",
  "Education & Training",
  "Government & Public Administration",
  "Defence & Security",
  "Construction & Real Estate",
  "Energy & Utilities",
  "Telecommunications",
  "Media & Journalism",
  "Creative Design & Multimedia",
  "Hospitality & Tourism",
  "Retail & E-commerce",
  "Agriculture & Agribusiness",
  "Nonprofit & Philanthropy",
  "Environment & Sustainability",
  "Insurance & Actuarial Services",
  "Economics & Public Policy",
  "Facilities Management",
  "Transportation & Aviation",
  "Entrepreneurship & General Management",
  "Office & Executive Support",
  "Skilled Trades & Technical Vocations",
  "Wellness & Fitness",
  "Other",
] as const;

// The sector a candidate works in (or wants to work in). Separate from
// profession: a software engineer can work in banking, telecom or healthcare.
export const INDUSTRIES = [
  "Banking & Financial Services",
  "Insurance",
  "Information Technology & Software",
  "Telecommunications",
  "Healthcare & Pharmaceuticals",
  "Education & Training",
  "Government & Public Sector",
  "Defence & Security",
  "Manufacturing & Production",
  "Energy & Utilities",
  "Construction & Real Estate",
  "Retail & E-commerce",
  "FMCG & Consumer Goods",
  "Hospitality & Tourism",
  "Transportation, Aviation & Logistics",
  "Agriculture & Agribusiness",
  "Media, Advertising & Entertainment",
  "Consulting & Professional Services",
  "Legal Services",
  "Nonprofit, Development & Philanthropy",
  "Other",
] as const;

// Highest completed (or current) qualification.
export const DEGREES = [
  "Matric / O-Levels",
  "Intermediate / A-Levels",
  "Diploma / Associate Degree",
  "Bachelor's degree",
  "Master's degree",
  "MPhil",
  "PhD / Doctorate",
  "Professional qualification (CA, ACCA, CFA, etc.)",
  "Other",
] as const;

export const GENDERS = ["Male", "Female", "Prefer not to say"] as const;

export const MIN_AGE = 16;
export const MAX_AGE = 75;

// Suggestions for the Location field. It stays free text so candidates outside
// these cities (or abroad) can still enter theirs.
export const SUGGESTED_LOCATIONS = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Faisalabad",
  "Multan",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Abbottabad",
  "Remote / Overseas",
];

export type Profession = (typeof PROFESSIONS)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type Degree = (typeof DEGREES)[number];
export type Gender = (typeof GENDERS)[number];

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

// The limit the form enforces before uploading. Vercel rejects request bodies
// over about 4.5 MB, so anything bigger never reaches the server check above.
// Raise this to match MAX_FILE_SIZE_BYTES once uploads go straight to Blob.
export const FORM_MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPTED_FILE_EXTENSIONS = ".pdf,.doc,.docx";
