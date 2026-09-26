/**
 * Small section header: muted label, optional heading, optional right meta.
 */
export default function SectionHeading({
  label,
  title,
  meta,
  id,
  level = 2,
  children,
  className = ''
}) {
  const Heading = `h${level}`;

  return (
    <header className={`section-head ${className}`.trim()}>
      <div>
        {label ? <span className="section-head__label label">{label}</span> : null}
        {title ? (
          <Heading className="h-section" id={id}>
            {title}
          </Heading>
        ) : null}
        {children}
      </div>
      {meta ? <span className="label tnum">{meta}</span> : null}
    </header>
  );
}
