import Link from 'next/link';

import FormSignIn from '@/components/auth/FormSignIn';
import SingInShowcase from '@/components/auth/SingInShowcase';

const SignInPage = () => {
  return (
    <section>
      <div className="app-container max-w-4xl min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-xl  overflow-hidden">
          {/* left */}
          <SingInShowcase />
          {/* right  */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-5 mt-5 md:mt-0 ">
            <div className="w-full mb-8">
              <h3>Welcome back! </h3>
              <p className="p14">Log in to your store account</p>
            </div>
            <FormSignIn />

            <p className="p13 text-center mt-5 w-full">
              Don&apos;t have an account?
              <Link
                href="/signup"
                className="text-title-secondary hover:underline"
              >
                {' '}
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
