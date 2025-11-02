import { LoginForm } from '@/components/auth/login-form';
import { AuthFormWrapper } from '@/components/auth/auth-form-wrapper';

export default function LoginPage() {
    return (
        <AuthFormWrapper
            title="Login"
            description="Enter your email below to login to your account."
            footerText="Don't have an account?"
            footerLink="/signup"
            footerLinkText="Sign up"
        >
            <LoginForm />
        </AuthFormWrapper>
    );
}
