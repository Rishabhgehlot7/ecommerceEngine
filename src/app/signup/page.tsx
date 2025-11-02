import { SignupForm } from '@/components/auth/signup-form';
import { AuthFormWrapper } from '@/components/auth/auth-form-wrapper';

export default function SignupPage() {
    return (
         <AuthFormWrapper
            title="Create an account"
            description="Enter your details below to create your account."
            footerText="Already have an account?"
            footerLink="/login"
            footerLinkText="Login"
        >
            <SignupForm />
        </AuthFormWrapper>
    );
}
