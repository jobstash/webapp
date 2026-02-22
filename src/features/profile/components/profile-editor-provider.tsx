'use client';

import { createContext, use, useState } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

import { ManualLinksEditorDialog } from './manual-links-editor-dialog';
import { ProfileSkillsEditor } from './profile-skills/profile-skills-editor';
import { useProfileSkillsEditor } from './profile-skills/use-profile-skills-editor';
import { ResumeUploadDialog } from './resume-upload-dialog';

interface ProfileEditorContextValue {
  openSkillsEditor: () => void;
  openResumeUpload: () => void;
  openManualLinksEditor: () => void;
}

const ProfileEditorContext = createContext<ProfileEditorContextValue | null>(
  null,
);

export const useProfileEditor = (): ProfileEditorContextValue => {
  const ctx = use(ProfileEditorContext);
  if (!ctx)
    throw new Error(
      'useProfileEditor must be used within ProfileEditorProvider',
    );
  return ctx;
};

export const ProfileEditorProvider = ({
  children,
}: React.PropsWithChildren) => {
  const { isSessionReady } = useSession();
  const { data: skills } = useProfileSkills(isSessionReady);
  const editor = useProfileSkillsEditor(skills ?? []);

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isManualLinksOpen, setIsManualLinksOpen] = useState(false);

  const value: ProfileEditorContextValue = {
    openSkillsEditor: () => editor.setIsOpen(true),
    openResumeUpload: () => setIsResumeOpen(true),
    openManualLinksEditor: () => setIsManualLinksOpen(true),
  };

  return (
    <ProfileEditorContext value={value}>
      {children}
      <ProfileSkillsEditor {...editor} />
      <ResumeUploadDialog
        isOpen={isResumeOpen}
        onOpenChange={setIsResumeOpen}
      />
      <ManualLinksEditorDialog
        isOpen={isManualLinksOpen}
        onOpenChange={setIsManualLinksOpen}
      />
    </ProfileEditorContext>
  );
};
