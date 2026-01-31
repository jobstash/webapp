import { AuthProviders } from '@/components/providers/auth-providers';

const ProfileLayout = ({ children }: React.PropsWithChildren) => {
  return <AuthProviders>{children}</AuthProviders>;
};

export default ProfileLayout;
