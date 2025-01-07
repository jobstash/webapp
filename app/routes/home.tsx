// import type { Route } from './+types/home'

import { FooterSection } from '~/lib/home/components/footer-section'
import { HeroSection } from '~/lib/home/components/hero-section'
import { InfoSection } from '~/lib/home/components/info-section'
import { JobCategoriesSection } from '~/lib/home/components/job-categories-section'
import { JobSkillsSection } from '~/lib/home/components/job-skills-section'
import { NewestJobsSection } from '~/lib/home/components/newest-jobs-section'
import { NoBsSection } from '~/lib/home/components/no-bs-section'
import { OrgSlide } from '~/lib/home/components/org-slide'
import { ShaderScripts } from '~/lib/home/components/shader-scripts'
import { SupportUsSection } from '~/lib/home/components/support-us-section'
import { TestimonialsSection } from '~/lib/home/components/testimonials-section'
import { WhatSetUsApartSection } from '~/lib/home/components/what-set-us-apart-section'

// export const meta = ({}: Route.MetaArgs) => {
export const meta = () => {
  return [
    { title: 'JobStash' },
    { name: 'description', content: 'Crypto Native Jobs' },
  ]
}

const Home = () => {
  return (
    <>
      <ShaderScripts />
      <main className="min-w-screen min-h-screen py-20 space-y-20 px-10">
        <HeroSection />
        <NewestJobsSection />
        <InfoSection />
        <NoBsSection />
        <JobCategoriesSection />
        <OrgSlide />
        <WhatSetUsApartSection />
        <TestimonialsSection />
        <SupportUsSection />
        <JobSkillsSection />
        <FooterSection />
      </main>
    </>
  )
}

export default Home
