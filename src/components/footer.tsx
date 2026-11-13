import { Wordmark } from "./wordmark";
import { EnquiryButton, PolicyButton } from "./enquiry-provider";
import { navigation } from "@/lib/content";

export function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-main"><div className="footer-brand"><a href="#home" className="brand-link" aria-label="Curabel Complex Care Group — back to top"><Wordmark /></a><p>Specialist complex care for children and young people, supporting families and brighter futures.</p></div><div className="footer-column"><p className="eyebrow">EXPLORE</p>{navigation.slice(0, 3).map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><p className="eyebrow">CONNECT</p><a href="#professionals">For professionals</a><EnquiryButton type="Careers enquiry" className="footer-link" arrow={false}>Careers</EnquiryButton><EnquiryButton className="footer-link" arrow={false}>Contact & referrals</EnquiryButton></div><div className="footer-note"><span className="status-dot" /><p>Thoughtful care.<br />Meaningful connections.<br />Brighter possibilities.</p></div></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Curabel Complex Care Group Ltd.</p><div><PolicyButton type="Privacy" /><PolicyButton type="Accessibility" /></div><span>HOMEPAGE DESIGN PREVIEW</span></div>
    <p className="stock-disclosure">Photography is illustrative and does not depict Curabel patients, staff or facilities. Company contact details and service availability are awaiting confirmation.</p>
  </div></footer>;
}
