import type { SelectOption } from "../../components/ui/SelectDropdown";

export const BRAND_COLOR = {
  primary: "emerald",
} as const;

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "", label: "Any" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Python", label: "Python" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "Java", label: "Java" },
  { value: "C#", label: "C#" },
  { value: "C++", label: "C++" },
  { value: "PHP", label: "PHP" },
];

export const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Updated" },
] as const;

export const PER_PAGE = 10;
