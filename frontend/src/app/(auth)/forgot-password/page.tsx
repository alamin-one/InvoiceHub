import Link from 'next/link';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import SingInShowcase from '@/components/auth/SingInShowcase';

const ForgotPasswordPage = () => {
  return (
    <section>
      <div className="app-container max-w-4xl min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-xl  overflow-hidden">
          {/* left */}
          <SingInShowcase />
          {/* right */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-5 mt-5 md:mt-0 ">
            <div className="w-full mb-8">
              <h3>Forgot your password?</h3>
              <p className="p14">Enter your email to receive a reset Code</p>
            </div>
            <ForgotPasswordForm />
            <p className="p13 text-center mt-5 w-full">
              back to{' '}
              <Link
                href="/signin"
                className=" text-title-secondary hover:underline"
              >
                login now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
