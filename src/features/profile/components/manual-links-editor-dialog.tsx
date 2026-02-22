'use client';

import { GlobeIcon, LoaderIcon } from 'lucide-react';

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
import { useManualLinksEditor } from '@/features/profile/hooks/use-manual-links-editor';

import { PillPicker } from './pill-picker';

interface ManualLinksEditorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualLinksEditorDialog = ({
  isOpen,
  onOpenChange,
}: ManualLinksEditorDialogProps) => {
  const {
    pillItems,
    selectedKinds,
    toggleKind,
    handles,
    setHandle,
    isSaving,
    error,
    handleSave,
    contactIcons,
    contactPlaceholders,
    contactLabels,
    selectedList,
  } = useManualLinksEditor({ isOpen, onOpenChange });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[92vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Contacts</DialogTitle>
          <DialogDescription>
            Add your website and social profiles
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <PillPicker
            items={pillItems}
            selectedKeys={selectedKinds}
            onToggle={toggleKind}
          />

          {selectedList.length > 0 && (
            <>
              <div className='h-px bg-border' />
              <div className='flex flex-col gap-3'>
                {selectedList.map((kind) => {
                  const Icon = contactIcons[kind] ?? GlobeIcon;
                  return (
                    <div
                      key={kind}
                      className='animate-in duration-200 fade-in-0 slide-in-from-top-2'
                    >
                      <InputGroup>
                        <InputGroupAddon>
                          <Icon className='size-4' />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={handles[kind] ?? ''}
                          onChange={(e) => setHandle(kind, e.target.value)}
                          placeholder={contactPlaceholders[kind] ?? 'handle'}
                          aria-label={contactLabels[kind] ?? kind}
                        />
                      </InputGroup>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {error && <FieldError>{error}</FieldError>}

        <DialogFooter>
          <Button
            variant='ghost'
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
