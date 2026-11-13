"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/content";
import { Wordmark } from "./wordmark";
import { EnquiryButton } from "./enquiry-provider";

export function Header() {
  const [expanded, setExpanded] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const close = () => { if (mq.matches) { menu.current?.close(); setExpanded(false); } };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const close = () => { menu.current?.close(); setExpanded(false); toggle.current?.focus(); };

  return <header className="site-header"><div className="container header-inner">
    <a href="#home" className="brand-link" aria-label="Curabel Complex Care Group — home"><Wordmark /></a>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}<EnquiryButton type="Careers enquiry" className="nav-link" arrow={false}>Careers</EnquiryButton></nav>
    <div className="header-actions"><EnquiryButton className="button button-outline header-enquiry">Make an enquiry</EnquiryButton><button ref={toggle} type="button" className="icon-button menu-toggle" aria-label="Open navigation" aria-expanded={expanded} aria-controls="mobile-navigation" onClick={() => { menu.current?.showModal(); setExpanded(true); }}><Menu size={25} /></button></div>
    <dialog ref={menu} id="mobile-navigation" className="mobile-dialog" aria-label="Mobile navigation" onCancel={() => setExpanded(false)} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="mobile-menu-inner"><div className="mobile-menu-top"><Wordmark /><button type="button" className="icon-button" aria-label="Close navigation" onClick={close}><X /></button></div><nav aria-label="Mobile navigation"><a href="#home" onClick={close}>Home</a>{navigation.map(item => <a key={item.href} href={item.href} onClick={close}>{item.label}</a>)}<a href="#contact" onClick={close}>Contact & enquiries</a></nav><p>Specialist care. A personal approach.</p></div>
    </dialog>
  </div></header>;
}
