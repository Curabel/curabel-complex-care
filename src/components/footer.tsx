import { getCompanyLinkedInUrl } from "@/lib/company";
import { Wordmark } from "./wordmark";
import { EnquiryButton, PolicyButton } from "./enquiry-provider";
import { navigation } from "@/lib/content";

export function Footer() {
  const companyLinkedInUrl = getCompanyLinkedInUrl();
  return <footer className="site-footer"><div className="container">
    <div className="footer-main"><div className="footer-brand"><a href="#home" className="brand-link" aria-label="Curabel Complex Care Group — back to top"><Wordmark /></a>{companyLinkedInUrl && <a className="footer-social-link" href={companyLinkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="Curabel Complex Care Group on LinkedIn (opens in a new tab)"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M11 17v-7M11 13a3 3 0 0 1 6 0v4" /><circle cx="7" cy="7" r=".5" fill="currentColor" /></svg></a>}<p>Specialist complex care for children and young people, supporting families and brighter futures.</p></div><div className="footer-column"><p className="eyebrow">EXPLORE</p>{navigation.slice(0, 3).map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><p className="eyebrow">CONNECT</p><a href="#professionals">For professionals</a><EnquiryButton type="Careers enquiry" className="footer-link" arrow={false}>Careers</EnquiryButton><EnquiryButton className="footer-link" arrow={false}>Contact & referrals</EnquiryButton></div><div className="footer-contact"><p className="eyebrow">OUR OFFICE</p><address><span>Curabel Complex Care Group Ltd</span><br />Hickman Building, Runway East<br />2 Whitechapel Road<br />London, E1 1EW<br />United Kingdom</address><a className="footer-phone" href="tel:+443338805696">0333 880 5696</a><a className="footer-email" href="mailto:enquiries@curabelcomplexcare.co.uk">enquiries@<wbr />curabelcomplexcare.co.uk</a><div className="footer-note"><span className="status-dot" /><p>Thoughtful care.<br />Meaningful connections.<br />Brighter possibilities.</p></div></div></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Curabel Complex Care Group Ltd.</p><div><PolicyButton type="Privacy" /><PolicyButton type="Accessibility" /></div></div>
    <p className="stock-disclosure">Photography is illustrative and does not depict Curabel patients, staff or facilities.</p>
    <p className="footer-design-credit">Designed by <a href="https://www.linkedin.com/in/siri-sandela/" target="_blank" rel="noopener noreferrer">Siri Sandela</a> &amp; <a href="https://www.outliersynapse.com/" target="_blank" rel="noopener noreferrer">Outlier Synapse</a></p>
  </div></footer>;
}
