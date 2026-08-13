import type { JobMarketSkillList, JobMarketSkillSummary } from '../schemas';

export const hasPublishableSkillCompensation = (
  skill: JobMarketSkillSummary,
): boolean =>
  skill.current.reliable &&
  skill.current.medianMonthlyUsd !== null &&
  skill.current.p25MonthlyUsd !== null &&
  skill.current.p75MonthlyUsd !== null;

export const withPublishableSkillCompensation = (
  list: JobMarketSkillList,
): JobMarketSkillList => ({
  ...list,
  skills: list.skills.filter(hasPublishableSkillCompensation),
});
