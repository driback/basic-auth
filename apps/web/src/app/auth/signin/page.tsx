import { DotPattern } from "~/components/background";
import AuthFormHeader from "~/components/pages/auth/auth-form-header";
import AuthLink from "~/components/pages/auth/auth-link";
import SigninForm from "~/components/pages/auth/signin-form";

const SignInPage = () => {
  return (
    <main className="grid size-full place-content-center">
      <DotPattern className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]" />
      <div className="z-10 flex w-[20rem] flex-col gap-8 rounded-lg border bg-background p-4 py-8 shadow-lg">
        <AuthFormHeader title="Welcome back" description="Good to see you again." />
        <SigninForm />
        <AuthLink text="Doesnt have an account?" href="/auth/signup" linkText="Sign Up Now" />
      </div>
    </main>
  );
};

export default SignInPage;
