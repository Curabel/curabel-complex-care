"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";

type EnquiryType = "Family enquiry" | "Professional referral" | "Careers enquiry";
type Panel = EnquiryType | "Privacy" | "Accessibility";
const PanelContext = createContext<(panel: Panel) => void>(() => {});

export function EnquiryButton({ children, type = "Family enquiry", className = "button button-primary", arrow = true }: { children: ReactNode; type?: EnquiryType; className?: string; arrow?: boolean }) {
  const open = useContext(PanelContext);
  return <button type="button" className={className} onClick={() => open(type)}>{children}{arrow && <ArrowUpRight size={17} aria-hidden="true" />}</button>;
}

export function PolicyButton({ type }: { type: "Privacy" | "Accessibility" }) {
  const open = useContext(PanelContext);
  return <button type="button" className="footer-policy" onClick={() => open(type)}>{type === "Privacy" ? "Privacy policy" : "Accessibility statement"}</button>;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<Panel>("Family enquiry");
  const [checked, setChecked] = useState(false);

  function open(next: Panel) {
    setPanel(next);
    setChecked(false);
    dialog.current?.showModal();
  }

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const observer = new MutationObserver(() => { document.body.style.overflow = modal.open ? "hidden" : ""; });
    observer.observe(modal, { attributes: true, attributeFilter: ["open"] });
    return () => { observer.disconnect(); document.body.style.overflow = ""; };
  }, []);

  const isPolicy = panel === "Privacy" || panel === "Accessibility";

  return <PanelContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className="enquiry-dialog" aria-labelledby="dialog-title" onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-content">
        <button type="button" className="icon-button dialog-close" onClick={() => dialog.current?.close()} aria-label="Close dialog"><X size={22} /></button>
        <p className="eyebrow">{isPolicy ? "DRAFT · FOR REVIEW" : "LET’S START A CONVERSATION"}</p>
        <h2 id="dialog-title">{isPolicy ? panel === "Privacy" ? "Your privacy matters." : "Designed to be accessible." : panel === "Careers enquiry" ? "Care with purpose." : "Every conversation starts with listening."}</h2>
        {isPolicy ? <div className="policy-copy">
          {panel === "Privacy" ? <><p>This is a draft privacy notice requiring professional review before the website launches.</p><h3>Who we are</h3><p>Curabel Complex Care Group Ltd. The registered address, data protection contact, lawful bases, retention periods and processor details are awaiting confirmation.</p><h3>This homepage preview</h3><p>The enquiry form checks information in your browser only. It does not send or store it on a server. Please do not enter personal medical information. This preview does not use analytics or advertising cookies.</p><h3>Before launch</h3><p>A final notice must explain how enquiries are handled, your data protection rights and how to raise a concern, including with the Information Commissioner’s Office.</p></> : <><p>This is a draft accessibility statement requiring review and an accessibility audit before launch.</p><h3>Our design approach</h3><p>This homepage has been designed with keyboard navigation, visible focus indicators, responsive layouts, descriptive image text and reduced-motion preferences in mind, working towards WCAG 2.2 AA.</p><h3>Known limitations</h3><p>This is a homepage preview. Other pages and live enquiry submission are not yet available. Full assistive technology testing and an accessible contact route are awaiting completion.</p><h3>Feedback</h3><p>An accessibility contact will be published once Curabel’s contact details are confirmed.</p></>}
        </div> : <>
          <p className="dialog-intro">{panel === "Careers enquiry" ? "Interested in supporting children and families as a Healthcare Assistant or Registered Nurse? Introduce yourself below." : "Tell us a little about what you’re looking for. Please keep patient names, diagnoses and other medical details out of this form."}</p>
          <div className="preview-notice"><span className="status-dot" />Homepage preview · enquiries are not being sent yet.</div>
          <form key={panel} onSubmit={(e) => { e.preventDefault(); setChecked(true); }} onChange={() => setChecked(false)}>
            <div className="form-grid"><label>Full name *<input name="name" autoComplete="name" required maxLength={100} /></label><label>Email address *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label></div>
            <div className="form-grid"><label>Telephone (optional)<input name="telephone" type="tel" autoComplete="tel" maxLength={30} /></label><label>Enquiry type<select name="type" defaultValue={panel}><option>Family enquiry</option><option>Professional referral</option><option>Careers enquiry</option></select></label></div>
            <label>Your message *<textarea name="message" rows={3} required minLength={10} maxLength={2000} placeholder="A brief introduction, without personal medical details." /></label>
            <label className="consent"><input name="consent" type="checkbox" required /><span>I understand this is a preview, my enquiry will not be sent, and I have not included patient health information.</span></label>
            <button className="button button-primary" type="submit">Check enquiry details <ArrowUpRight size={17} aria-hidden="true" /></button>
            <p className="form-result" role="status">{checked && <><Check size={18} aria-hidden="true" />Details checked in your browser. Nothing has been sent or saved. The enquiry service will be connected before launch.</>}</p>
          </form>
        </>}
      </div>
    </dialog>
  </PanelContext.Provider>;
}
