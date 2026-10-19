import Image from "next/image"
import type { Project } from "@/lib/projects"
import type { CaseStudyEvidence } from "@/lib/caseStudyEvidence"
import styles from "./CaseStudySummary.module.css"

export function CaseStudySummary({ project, evidence }: { project: Project; evidence: CaseStudyEvidence }) {
  return (
    <section id="project-summary" aria-labelledby="project-summary-title" className={styles.section} data-case-summary={project.slug}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>OVERVIEW & EVIDENCE</p>
          <h2 id="project-summary-title">Project at a glance</h2>
        </div>
        <dl className={styles.meta}>
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Timeline</dt><dd>{evidence.duration ?? project.year}{evidence.ongoing && " · Ongoing"}</dd></div>
        </dl>
      </div>

      <div className={styles.grid}>
        <dl className={styles.facts}>
          <div><dt>Problem</dt><dd>{evidence.problem}</dd></div>
          <div><dt>What I built</dt><dd>{evidence.contribution}</dd></div>
          <div className={styles.limitations}><dt>Current limitations</dt><dd>{evidence.limitations}</dd></div>
        </dl>

        <div className={styles.evidence}>
          <figure className={styles.figure}>
            <div className={styles.mediaHeading}><span>PRODUCT CAPTURE</span><span>{evidence.media.kind}</span></div>
            <a className={styles.imageLink} href={evidence.media.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${project.title} screenshot (opens in a new tab)`}>
              <Image src={evidence.media.src} alt={evidence.media.alt} width={1920} height={900} unoptimized loading="eager" className={styles.image} />
              <span className={styles.expand} aria-hidden="true">View full size ↗</span>
            </a>
            <figcaption>{evidence.media.caption}</figcaption>
          </figure>

          <div className={styles.result}>
            <h3><span aria-hidden="true" />{evidence.resultLabel}</h3>
            <p>{evidence.result}</p>
            <div className={styles.proofLinks}>
              {evidence.proof.map((proof) => <a key={proof.url} href={proof.url} target="_blank" rel="noopener noreferrer">{proof.label}<span aria-hidden="true">↗</span></a>)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          {project.links.live && <a href={project.links.live.trim()} target="_blank" rel="noopener noreferrer">Open live demo <span aria-hidden="true">↗</span></a>}
          <a href={project.links.github} target="_blank" rel="noopener noreferrer">GitHub repository <span aria-hidden="true">↗</span></a>
        </div>
        <a href={`#${evidence.walkthroughId}`} className={styles.walkthrough}>Explore the architecture <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  )
}
