import { SessionRedirect } from '@/features/auth/components/session-redirect';
import { LoginContent } from '@/features/auth/components/login-content';

const LoginPage = () => (
  <SessionRedirect redirectUrl='/'>
    <LoginContent />
  </SessionRedirect>
);

export default LoginPage;
