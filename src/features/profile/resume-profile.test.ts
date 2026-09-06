import { describe, expect, it } from 'vitest';
import { recommendationPreferenceDefaults } from './job-preferences';
import {
  resumeProfileDefaults,
  resumeCareerUpdateSchema,
  supportedResumeDates,
} from './resume-profile';

const extraction = {
  name: 'Example Candidate',
  location: { city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL' },
  roleCategory: 'Engineer',
  career: {
    roles: [
      {
        title: 'Senior Engineer',
        company: 'Former Employer',
        description: 'Build distributed systems.',
        startDate: null,
        endDate: null,
        current: true,
        seniority: 'senior' as const,
      },
    ],
    educationLevel: 'master' as const,
  },
  preferences: {
    ...recommendationPreferenceDefaults,
    workModes: null,
    residenceCountry: null,
    utcOffset: null,
    workAuthorization: null,
    requiresSponsorship: null,
    attendancePreference: null,
    travelTolerance: null,
    languages: ['English', 'Dutch'],
  },
};
describe('CV profile defaults', () => {
  it('does not manufacture full dates from a year or month-only CV date', () => {
    const career = {
      ...extraction.career,
      roles: [
        {
          ...extraction.career.roles[0],
          startDate: '2022-01-01',
          endDate: '2023-02-02',
        },
      ],
    };
    expect(
      supportedResumeDates(career, 'Jan 2022 to 2023-02-02').roles[0],
    ).toMatchObject({ startDate: null, endDate: '2023-02-02' });
    expect(
      supportedResumeDates(career, 'January 1, 2022 to 2 February 2023')
        .roles[0],
    ).toMatchObject({ startDate: '2022-01-01', endDate: '2023-02-02' });
  });
  it('populates current residence, education, languages, current role/seniority and matched skills', () => {
    const result = resumeProfileDefaults(extraction, [{ name: 'Rust' }]);
    expect(result.profile).toEqual({
      name: extraction.name,
      location: extraction.location,
    });
    expect(result.preferences).toEqual({
      residenceCountry: 'NL',
      educationLevel: 'master',
      rolePriorities: ['Senior Engineer'],
      seniorityLevels: ['senior'],
      languages: ['English', 'Dutch'],
      preferredSkills: ['Rust'],
    });
    expect(result.roles).toEqual(extraction.career.roles);
  });
  it('uses explicitly stated target preferences rather than replacing them with current residence/career', () => {
    const result = resumeProfileDefaults(
      {
        ...extraction,
        preferences: {
          ...extraction.preferences,
          residenceCountry: 'DE',
          rolePriorities: ['Engineering Manager'],
          seniorityLevels: ['lead'],
          workModes: ['remote'],
        },
      },
      [],
    );
    expect(result.preferences).toMatchObject({
      residenceCountry: 'DE',
      rolePriorities: ['Engineering Manager'],
      seniorityLevels: ['lead'],
      workModes: ['remote'],
    });
  });
  it('does not manufacture salary, authorization, sponsorship, target employers or work modes', () => {
    const result = resumeProfileDefaults(extraction, []);
    for (const field of [
      'minimumSalary',
      'salaryCurrency',
      'workAuthorization',
      'requiresSponsorship',
      'workModes',
      'targetOrganizations',
      'utcOffset',
      'searchStatus',
    ])
      expect(result.preferences).not.toHaveProperty(field);
  });
  it('does not derive current seniority from an old role or guess missing location', () => {
    const result = resumeProfileDefaults(
      {
        ...extraction,
        location: null,
        career: {
          ...extraction.career,
          roles: [{ ...extraction.career.roles[0], current: false }],
        },
      },
      [],
    );
    expect(result.preferences).not.toHaveProperty('residenceCountry');
    expect(result.preferences).not.toHaveProperty('seniorityLevels');
  });
  it('rejects invalid preference values on the save API', () => {
    expect(
      resumeCareerUpdateSchema.safeParse({
        roles: [],
        educationLevel: null,
        preferences: { residenceCountry: 'Singapore' },
      }).success,
    ).toBe(false);
  });
});
