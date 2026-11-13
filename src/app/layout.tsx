import type { Metadata } from "next";
import "./globals.css";
import { EnquiryProvider } from "@/components/enquiry-provider";

export const metadata: Metadata = {
  title: "Curabel | Specialist complex care, with family at the heart",
  description: "A personal approach to complex care for children and young people at home. Discover Curabel’s family-centred philosophy and clinical care model.",
  robots: { index: false, follow: false },
  openGraph: { title: "Curabel Complex Care Group", description: "Specialist care. Familiar surroundings. Brighter futures.", type: "website", locale: "en_GB" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body><a className="skip-link" href="#main">Skip to content</a><EnquiryProvider>{children}</EnquiryProvider></body></html>;
}
