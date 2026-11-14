import Image from "next/image";
import { DirectorLink } from "./director-link";
import { differentiators, directorStatement, joelBiography } from "@/lib/client-content";

export function WhyCurabel() {
  return <section id="why-curabel" className="section why-curabel" aria-labelledby="why-curabel-title">
    <div className="container">
      <div className="why-introduction">
        <p className="eyebrow section-label">THE CURABEL DIFFERENCE</p>
        <h2 id="why-curabel-title">Why Choose Curabel Complex Care?</h2>
        <p>At Curabel, we bring together specialist clinical leadership, workforce coordination, child-specific training and operational expertise to provide a more connected approach to children&apos;s complex care.</p>
      </div>
      <div className="difference-grid">
        {differentiators.map((item, index) => <article className="difference-item" key={item.title}>
          <span className="difference-number" aria-hidden="true">0{index + 1}</span>
          <h3>{item.title}</h3>
          {item.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </article>)}
      </div>
    </div>
  </section>;
}

export function ClinicalDirector() {
  const directors = [
    { name: "Caroline McKnight" as const, email: "caroline.mcknight@curabelcomplexcare.co.uk", title: "Registered Children's Nurse | Clinical Director", image: "/images/caroline.png", summary: "Caroline brings 28 years of paediatric nursing experience across the NHS, independent healthcare and social care. Her approach centres on strong clinical governance, safeguarding and the voice of every child.", paragraphs: directorStatement },
    { name: "Joel Alter" as const, email: "joel.alter@curabelcomplexcare.co.uk", title: "Director of Operations", image: "/images/joel-alter.png", summary: "Joel brings extensive experience in recruitment, workforce management and business operations. At Curabel, he oversees business strategy, operational development, recruitment and commercial growth.", paragraphs: joelBiography },
  ];
  return <section id="leadership" className="section container director-section" aria-labelledby="leadership-title">
    <p className="eyebrow section-label">04 / CLINICAL LEADERSHIP</p>
    <div className="directors-heading">
      <h2 id="leadership-title">Meet Our Directors</h2>
      <p>Combining specialist clinical leadership with experienced operational expertise to deliver compassionate, individualised complex care.</p>
    </div>
    <div className="directors-grid">
      {directors.map(director => <article className="director-profile" key={director.name}>
        <div className="director-photo">
          <Image src={director.image} alt={director.name} fill sizes="(max-width: 700px) 88vw, (max-width: 1099px) 40vw, 360px" />
        </div>
        <div className="director-copy">
          <div className="director-name-row"><h3>{director.name}</h3><DirectorLink name={director.name} /></div>
          <p className="director-title">{director.title}</p>
          <a className="director-email" href={`mailto:${director.email}`}>{director.email}</a>
          <p className="director-summary">{director.summary}</p>
          <details className="director-full-profile">
            <summary aria-label={`Read full profile of ${director.name}`}>Read full profile</summary>
            <div className="director-statement">
              {director.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {director.name === "Caroline McKnight" && <p className="director-attribution">— Caroline McKnight, Registered Children&apos;s Nurse</p>}
          </details>
        </div>
      </article>)}
    </div>
    <div className="directors-closing">
      <blockquote>Above all, we believe that the true measure of quality care is not simply what we do for a child, but the difference that care makes to their life.</blockquote>
      <p>This philosophy continues in our commitment to the children, young people and families Curabel exists to support.</p>
    </div>
  </section>;
}
