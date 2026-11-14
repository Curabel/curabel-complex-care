import { ArrowUpRight } from "lucide-react";

const profiles = {
  "Caroline McKnight": "https://www.linkedin.com/in/caroline-mcknight-31a1abb1/",
  "Joel Alter": "https://www.linkedin.com/in/joel-alter-46a8486a/",
} as const;

export function DirectorLink({ name }: { name: keyof typeof profiles }) {
  return <a
    className="text-link director-link"
    href={profiles[name]}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${name} on LinkedIn (opens in a new tab)`}
  >
    <span>LinkedIn</span>
    <ArrowUpRight size={16} aria-hidden="true" />
  </a>;
}
