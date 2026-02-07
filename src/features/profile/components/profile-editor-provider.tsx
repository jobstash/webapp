'use client';

import { createContext, use, useState } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

import { ProfileSkillsEditor } from './profile-skills/profile-skills-editor';
import { useProfileSkillsEditor } from './profile-skills/use-profile-skills-editor';
import { ResumeUploadDialog } from './resume-upload-dialog';
import { ContactInfoEditorDialog } from './contact-info-editor-dialog';
import { SocialsEditorDialog } from './socials-editor-dialog';

interface ProfileEditorContextValue {
  openSkillsEditor: () => void;
  openResumeUpload: () => void;
  openContactInfoEditor: () => void;
  openSocialsEditor: () => void;
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
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [isSocialsOpen, setIsSocialsOpen] = useState(false);

  const value: ProfileEditorContextValue = {
    openSkillsEditor: () => editor.setIsOpen(true),
    openResumeUpload: () => setIsResumeOpen(true),
    openContactInfoEditor: () => setIsContactInfoOpen(true),
    openSocialsEditor: () => setIsSocialsOpen(true),
  };

  return (
    <ProfileEditorContext value={value}>
      {children}
      <ProfileSkillsEditor {...editor} />
      <ResumeUploadDialog
        isOpen={isResumeOpen}
        onOpenChange={setIsResumeOpen}
      />
      <ContactInfoEditorDialog
        isOpen={isContactInfoOpen}
        onOpenChange={setIsContactInfoOpen}
      />
      <SocialsEditorDialog
        isOpen={isSocialsOpen}
        onOpenChange={setIsSocialsOpen}
      />
    </ProfileEditorContext>
  );
};
