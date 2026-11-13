"use client";

import { useEffect } from "react";

/** Progressive enhancement: content is visible before JS and observers never hide it. */
export function PageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const played = new WeakSet<Element>();
    const running = new Set<Animation>();
    const selectors = [
      "main section:not(.hero) h2", ".about-copy > p", ".section-heading > p",
      ".professional-intro > p", ".leadership-intro > p", ".about-figure",
      ".service-item", ".care-steps article", ".leadership-profile",
      ".audience-list article", ".clinical-note", ".contact-action",
      ".footer-brand > p", ".footer-column", ".footer-note", ".footer-bottom",
    ];
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || played.has(entry.target)) continue;
        played.add(entry.target);
        reveal.unobserve(entry.target);
        if (preference.matches) continue;
        const target = entry.target as HTMLElement;
        const siblings = target.parentElement ? Array.from(target.parentElement.children) : [];
        const stagger = target.matches(".service-item, .care-steps article, .audience-list article, .footer-column");
        const delay = stagger ? (siblings.indexOf(target) % 3) * 80 : target.matches("p") ? 80 : 0;
        const photo = target.matches(".about-figure");
        const animation = target.animate([
          { opacity: 0, transform: photo ? "translateY(10px)" : "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: photo ? 750 : 550, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
        running.add(animation);
        animation.onfinish = () => running.delete(animation);
        if (target.matches(".care-steps article")) target.classList.add("journey-revealed");
      }
    }, { threshold: 0.12 });
    document.querySelectorAll(selectors.join(",")).forEach(el => reveal.observe(el));
    const cancel = () => { if (preference.matches) { running.forEach(animation => animation.cancel()); running.clear(); } };
    preference.addEventListener("change", cancel);

    const header = document.querySelector(".site-header");
    const hero = document.querySelector(".hero");
    const sticky = new IntersectionObserver(([entry]) => header?.classList.toggle("is-scrolled", !entry.isIntersecting), { rootMargin: "-140px 0px 0px 0px" });
    if (hero) sticky.observe(hero);
    const sectionObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      document.querySelectorAll(".desktop-nav a, .mobile-menu-inner nav a").forEach(link => {
        if (link.getAttribute("href") === `#${active.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -45% 0px", threshold: 0 });
    document.querySelectorAll("main section[id]").forEach(el => sectionObserver.observe(el));
    return () => { reveal.disconnect(); sticky.disconnect(); sectionObserver.disconnect(); running.forEach(animation => animation.cancel()); preference.removeEventListener("change", cancel); };
  }, []);
  return null;
}
