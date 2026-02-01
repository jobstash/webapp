export const GA_EVENT = {
  // Discovery
  FILTER_APPLIED: 'filter_applied',
  FILTER_REMOVED: 'filter_removed',
  SEARCH_QUERY: 'search_query',
  PILLAR_CLICKED: 'pillar_clicked',

  // Browsing
  JOB_LIST_VIEWED: 'job_list_viewed',
  PAGINATION_CLICKED: 'pagination_clicked',
  JOB_CARD_CLICKED: 'job_card_clicked',

  // Interest
  JOB_DETAILS_VIEWED: 'job_details_viewed',
  SIMILAR_JOB_CLICKED: 'similar_job_clicked',

  // Conversion
  APPLY_BUTTON_CLICKED: 'apply_button_clicked',

  // Auth
  LOGIN_STARTED: 'login_started',
  LOGIN_COMPLETED: 'login_completed',
  ONBOARDING_STEP_VIEWED: 'onboarding_step_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_PROFILE_SYNCED: 'onboarding_profile_synced',

  // Navigation
  HERO_CTA_CLICKED: 'hero_cta_clicked',
  SUGGESTED_FILTER_APPLIED: 'suggested_filter_applied',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
} as const;

export type GaEventParams = {
  [GA_EVENT.FILTER_APPLIED]: {
    filter_name: string;
    filter_value: string;
    filter_type: string;
    analytics_id?: string;
    analytics_name?: string;
  };
  [GA_EVENT.FILTER_REMOVED]: {
    filter_name: string;
  };
  [GA_EVENT.SEARCH_QUERY]: {
    search_query: string;
  };
  [GA_EVENT.PILLAR_CLICKED]: {
    pillar_slug: string;
    pillar_category: string;
    source: string;
  };
  [GA_EVENT.JOB_LIST_VIEWED]: {
    page_number: number;
  };
  [GA_EVENT.PAGINATION_CLICKED]: {
    page_number: number;
  };
  [GA_EVENT.JOB_CARD_CLICKED]: {
    job_id: string;
    job_title: string;
    organization: string;
  };
  [GA_EVENT.JOB_DETAILS_VIEWED]: {
    job_id: string;
    job_title: string;
    organization: string;
  };
  [GA_EVENT.SIMILAR_JOB_CLICKED]: {
    job_id: string;
    source: string;
  };
  [GA_EVENT.APPLY_BUTTON_CLICKED]: {
    job_id: string;
    job_title: string;
    organization: string;
    apply_destination?: string;
  };
  [GA_EVENT.LOGIN_STARTED]: {
    login_method: string;
  };
  [GA_EVENT.LOGIN_COMPLETED]: {
    login_method: string;
  };
  [GA_EVENT.ONBOARDING_STEP_VIEWED]: {
    step_number: number;
    step_name: string;
  };
  [GA_EVENT.ONBOARDING_COMPLETED]: Record<string, never>;
  [GA_EVENT.ONBOARDING_PROFILE_SYNCED]: {
    skills_count: number;
    socials_count: number;
    has_resume: boolean;
    success: boolean;
  };
  [GA_EVENT.HERO_CTA_CLICKED]: {
    source: string;
  };
  [GA_EVENT.SUGGESTED_FILTER_APPLIED]: {
    filter_name: string;
  };
  [GA_EVENT.EXTERNAL_LINK_CLICKED]: {
    destination: string;
    source: string;
  };
};
