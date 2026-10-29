export interface CVItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  /** The candidate's profession (labelled "Profession" in the UI). */
  domain: string;
  industry: string | null;
  degree: string | null;
  gender: string | null;
  age: number | null;
  /** Person with a disability. */
  pwd: boolean;
  experienceYears: number | null;
  currentRole: string | null;
  currentCompany: string | null;
  education: string | null;
  skills: string | null;
  /** The candidate's location (labelled "Location" in the UI). */
  city: string | null;
  notes: string | null;
  fileUrl: string;
  filePathname: string;
  fileName: string;
  fileSize: number | null;
  fileType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CVListResponse {
  items: CVItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Values the admin filters offer, taken from what is actually on file. */
export interface FilterOptions {
  professions: string[];
  industries: string[];
  degrees: string[];
  locations: string[];
  genders: string[];
}

/** The admin dashboard's filter state. */
export interface CVFilters {
  professions: string[];
  industries: string[];
  degrees: string[];
  locations: string[];
  genders: string[];
  ageMin: string;
  ageMax: string;
  pwdOnly: boolean;
}

export const EMPTY_FILTERS: CVFilters = {
  professions: [],
  industries: [],
  degrees: [],
  locations: [],
  genders: [],
  ageMin: "",
  ageMax: "",
  pwdOnly: false,
};
