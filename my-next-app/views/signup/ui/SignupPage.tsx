import { SignupBanner, SignupForm } from "@/features/signup";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="hidden lg:flex lg:min-h-screen lg:w-1/2">
        <SignupBanner />
      </div>

      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold">회원가입</h1>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
