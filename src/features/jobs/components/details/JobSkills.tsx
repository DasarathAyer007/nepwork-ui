interface Props {
  skills: string[];
}

function JobSkills({ skills }: Props) {
  if (!skills.length) return null;

  return (
    <div>
      <h3 className="text-headline-sm font-bold text-on-surface mb-3">Skills Required</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-body-md rounded-full border border-outline-variant/50">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default JobSkills;