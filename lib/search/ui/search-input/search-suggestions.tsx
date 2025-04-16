'use client';

import { Button } from '@/lib/shared/ui/base/button';

const SKILLS = ['React', 'TypeScript', 'Rust', 'Python', 'Golang', 'AWS'];
const ROLES = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Scientist'];
const COMPANIES = ['Google', 'Meta', 'Netflix', 'Apple', 'Microsoft'];

export const SearchSuggestions = () => {
  return (
    <div className='relative w-full py-4 pl-1 text-sm text-neutral-400'>
      <div className='flex flex-col gap-6'>
        {/* Suggested Skills */}
        <div className='flex flex-col gap-2'>
          <span className='text-xs font-semibold text-white'>Suggested Skills</span>
          <div className='flex flex-wrap gap-2'>
            {SKILLS.map((skill) => (
              <Button
                key={skill}
                size='sm'
                variant='secondary'
                className='border border-neutral-700/50'
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggested Roles */}
        <div className='flex flex-col gap-2'>
          <span className='text-xs font-semibold text-white'>Suggested Roles</span>
          <div className='flex flex-wrap gap-2'>
            {ROLES.map((role) => (
              <Button
                key={role}
                size='sm'
                variant='secondary'
                className='border border-neutral-700/50'
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggested Companies */}
        <div className='flex flex-col gap-2'>
          <span className='text-xs font-semibold text-white'>Suggested Companies</span>
          <div className='flex flex-wrap gap-2'>
            {COMPANIES.map((company) => (
              <Button
                key={company}
                size='sm'
                variant='secondary'
                className='border border-neutral-700/50'
              >
                {company}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
