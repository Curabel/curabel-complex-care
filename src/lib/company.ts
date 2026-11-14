// Set this to the confirmed https://www.linkedin.com/company/... URL when supplied.
// An empty or invalid value keeps the footer icon hidden.
export const companyLinkedInUrl: string = "";

export function getCompanyLinkedInUrl(): string | null {
  try {
    const url = new URL(companyLinkedInUrl);
    return url.protocol === "https:" &&
      ["www.linkedin.com", "linkedin.com"].includes(url.hostname) &&
      /^\/company\/[^/]+\/?$/.test(url.pathname) &&
      !url.username && !url.password && !url.port
      ? url.href : null;
  } catch {
    return null;
  }
}
