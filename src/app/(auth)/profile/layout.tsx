import { AppFooter } from '@/components/app-footer/app-footer';
import { AppHeader } from '@/components/app-header/app-header';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ProfileBottomNav } from '@/features/profile/components/profile-bottom-nav';
import { ProfileEditorProvider } from '@/features/profile/components/profile-editor-provider';
import { ProfileErrorBoundary } from '@/features/profile/components/profile-error-boundary';
import { ProfileLogoutOverlay } from '@/features/profile/components/profile-logout-overlay';
import { ProfileSidebar } from '@/features/profile/components/profile-sidebar';

const ProfileLayout = ({ children }: React.PropsWithChildren) => (
  <>
    <AppHeader />
    <main className='mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-2 pt-4 lg:min-h-[calc(100vh-5rem)]'>
      <AuthGuard>
        <ProfileEditorProvider>
          <ProfileLogoutOverlay />
          <div className='flex gap-4'>
            <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
              <ProfileSidebar />
            </aside>
            <section className='flex min-w-0 grow flex-col gap-4 pb-16 lg:pb-0'>
              <ProfileErrorBoundary>{children}</ProfileErrorBoundary>
            </section>
          </div>
          <ProfileBottomNav />
        </ProfileEditorProvider>
      </AuthGuard>
    </main>
    <AppFooter />
  </>
);

export default ProfileLayout;
