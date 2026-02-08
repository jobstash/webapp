import { AuthProviders } from '@/components/providers/auth-providers';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ProfileEditorProvider } from '@/features/profile/components/profile-editor-provider';
import { ProfileLogoutOverlay } from '@/features/profile/components/profile-logout-overlay';
import { ProfileNav } from '@/features/profile/components/profile-nav';
import { ProfileSidebar } from '@/features/profile/components/profile-sidebar';

const ProfileLayout = ({ children }: React.PropsWithChildren) => (
  <AuthProviders>
    <AuthGuard>
      <ProfileEditorProvider>
        <ProfileLogoutOverlay />
        <div className='flex gap-4'>
          <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
            <ProfileSidebar />
          </aside>
          <section className='flex min-w-0 grow flex-col gap-4'>
            <ProfileNav />
            {children}
          </section>
        </div>
      </ProfileEditorProvider>
    </AuthGuard>
  </AuthProviders>
);

export default ProfileLayout;
