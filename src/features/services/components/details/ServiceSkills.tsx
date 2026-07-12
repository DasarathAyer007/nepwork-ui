interface Props {
  skills: string[];
}

function ServiceSkills({ skills }: Props) {
  if (!skills.length) return null;

  return (
    <section>
      <h2 className="text-headline-sm font-bold text-on-surface mb-4">
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-md"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default ServiceSkills;