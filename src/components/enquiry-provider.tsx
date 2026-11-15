"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { PrivacyPolicy } from "./privacy-policy";

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
  const trigger = useRef<HTMLElement | null>(null);
  const [panel, setPanel] = useState<Panel>("Family enquiry");
  const [checked, setChecked] = useState(false);

  function open(next: Panel) {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPanel(next);
    setChecked(false);
    dialog.current?.showModal();
    if (dialog.current) dialog.current.scrollTop = 0;
  }

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const originalOverflow = document.body.style.overflow;
    const observer = new MutationObserver(() => { document.body.style.overflow = modal.open ? "hidden" : originalOverflow; });
    observer.observe(modal, { attributes: true, attributeFilter: ["open"] });
    return () => { observer.disconnect(); document.body.style.overflow = originalOverflow; };
  }, []);

  const isPolicy = panel === "Privacy" || panel === "Accessibility";

  return <PanelContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className={`enquiry-dialog${panel === "Privacy" ? " privacy-dialog" : ""}`} aria-labelledby="dialog-title" onClose={() => trigger.current?.focus({ preventScroll: true })} onKeyDown={(e) => {
      if (e.key !== "Tab") return;
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }} onClick={(e) => {
      if (e.target !== e.currentTarget) return;
      const bounds = e.currentTarget.getBoundingClientRect();
      if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) dialog.current?.close();
    }}>
      <div className="dialog-controls">
        <button type="button" className="icon-button dialog-close" onClick={() => dialog.current?.close()} aria-label="Close dialog"><X size={22} /></button>
      </div>
      <div className="dialog-content">
        {panel !== "Privacy" && <p className="eyebrow">{isPolicy ? "DRAFT · FOR REVIEW" : "LET’S START A CONVERSATION"}</p>}
        <h2 id="dialog-title">{isPolicy ? panel === "Privacy" ? "Privacy Policy" : "Designed to be accessible." : panel === "Careers enquiry" ? "Care with purpose." : "Every conversation starts with listening."}</h2>
        {panel === "Privacy" && <>
          <p className="policy-updated">Last updated: <time dateTime="2026-11-15">15 November 2026</time></p>

        </>}
        {isPolicy ? <div className="policy-copy">
          {panel === "Privacy" ? <PrivacyPolicy /> : <><p>This is a draft accessibility statement requiring review and an accessibility audit before launch.</p><h3>Our design approach</h3><p>This homepage has been designed with keyboard navigation, visible focus indicators, responsive layouts, descriptive image text and reduced-motion preferences in mind, working towards WCAG 2.2 AA.</p><h3>Known limitations</h3><p>This is a homepage preview. Other pages and live enquiry submission are not yet available. Full assistive technology testing and an accessible contact route are awaiting completion.</p><h3>Feedback</h3><p>An accessibility contact will be published once Curabel’s contact details are confirmed.</p></>}
        </div> : <>
          <p className="dialog-intro">{panel === "Careers enquiry" ? "Interested in supporting children and families as a Healthcare Assistant or Registered Nurse? Introduce yourself below." : "Tell us a little about what you’re looking for. Please keep patient names, diagnoses and other medical details out of this form."}</p>
          <p className="dialog-intro">Please do not include sensitive patient or child health information in this general enquiry form.</p>
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
