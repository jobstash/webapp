'use client';

import { GlobeIcon, LoaderIcon, MailIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useContactInfoEditor } from '@/features/profile/hooks/use-contact-info-editor';

import { PillPicker, type PillPickerItem } from './pill-picker';

const CONTACT_ITEMS: PillPickerItem[] = [
  { key: 'email', label: 'Email', icon: MailIcon },
  { key: 'website', label: 'Website', icon: GlobeIcon },
];

interface ContactInfoEditorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactInfoEditorDialog = ({
  isOpen,
  onOpenChange,
}: ContactInfoEditorDialogProps) => {
  const {
    selectedKinds,
    toggleKind,
    email,
    setEmail,
    websiteUrl,
    setWebsiteUrl,
    isSaving,
    error,
    handleSave,
  } = useContactInfoEditor({ isOpen, onOpenChange });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Contact Info</DialogTitle>
          <DialogDescription>Add your email and website</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <PillPicker
            items={CONTACT_ITEMS}
            selectedKeys={selectedKinds}
            onToggle={toggleKind}
          />

          {selectedKinds.has('email') && (
            <div className='animate-in duration-200 fade-in-0 slide-in-from-top-2'>
              <InputGroup>
                <InputGroupAddon>
                  <MailIcon className='size-4' />
                </InputGroupAddon>
                <InputGroupInput
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  aria-label='Email'
                />
              </InputGroup>
            </div>
          )}

          {selectedKinds.has('website') && (
            <div className='animate-in duration-200 fade-in-0 slide-in-from-top-2'>
              <InputGroup>
                <InputGroupAddon>
                  <GlobeIcon className='size-4' />
                </InputGroupAddon>
                <InputGroupInput
                  type='url'
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder='https://yoursite.com'
                  aria-label='Website'
                />
              </InputGroup>
            </div>
          )}
        </div>

        {error && <FieldError>{error}</FieldError>}

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <LoaderIcon className='size-4 animate-spin' />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
