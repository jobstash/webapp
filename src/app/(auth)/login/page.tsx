import { SessionRedirect } from '@/features/auth/components/session-redirect';
import { LoginContent } from '@/features/auth/components/login-content';

const LoginPage = () => (
  <SessionRedirect redirectUrl='/profile/jobs'>
    <LoginContent />
  </SessionRedirect>
);

export default LoginPage;
