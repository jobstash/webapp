type SkillIdentity = { id: string; name: string };

export const uniqueSkills = <T extends SkillIdentity>(
  skills: readonly T[],
  excluded: readonly SkillIdentity[] = [],
): T[] => {
  const ids = new Set(excluded.map((skill) => skill.id));
  const names = new Set(
    excluded.map((skill) => skill.name.trim().toLowerCase()),
  );
  return skills.filter((skill) => {
    const name = skill.name.trim().toLowerCase();
    if (!name || ids.has(skill.id) || names.has(name)) return false;
    ids.add(skill.id);
    names.add(name);
    return true;
  });
};
