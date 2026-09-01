import Link from 'next/link';

import FormSignUp from '@/components/auth/FormSignUp';
import SingInShowcase from '@/components/auth/SingInShowcase';

const SignUpPage = () => {
  return (
    <section>
      <div className="app-container max-w-4xl min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-xl  overflow-hidden">
          {/* left */}
          <SingInShowcase />
          {/* right */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-5 mt-5 md:mt-0">
            <div className="w-full mb-8">
              <h3>Create account </h3>
              <p className="p13">Create a new store account</p>
            </div>
            <FormSignUp />

            <p className="p14 text-center mt-5 w-full">
              Already have an account?
              <Link
                href="/signin"
                className="text-title-secondary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
