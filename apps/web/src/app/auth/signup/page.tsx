import { DotPattern } from "~/components/background";
import AuthFormHeader from "~/components/pages/auth/auth-form-header";
import AuthLink from "~/components/pages/auth/auth-link";
import SignupForm from "~/components/pages/auth/signup-form";

const SignupPage = () => {
  return (
    <main className="grid size-full place-content-center">
      <DotPattern className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]" />
      <div className="z-10 flex w-[20rem] flex-col gap-8 rounded-lg border bg-background p-4 py-8 shadow-lg">
        <AuthFormHeader title="Get Started" description="Create new account" />
        <SignupForm />
        <AuthLink text="Have an account?" href="/auth/signin" linkText="Sign In Now" />
      </div>
    </main>
  );
};

export default SignupPage;
