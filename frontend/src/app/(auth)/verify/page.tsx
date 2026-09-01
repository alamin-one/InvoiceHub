import Link from 'next/link';
import { Suspense } from 'react';

import FromVerification from '@/components/auth/From-Verification';
import SingInShowcase from '@/components/auth/SingInShowcase';
import Loading from '@/lib/Loading';

const VerifyPage = () => {
  return (
    <section>
      <div className="app-container max-w-4xl min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-xl  overflow-hidden">
          {/* left */}
          <SingInShowcase />
          {/* right */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-5 mt-5 md:mt-0 ">
            <div className="md:block w-full mb-8">
              <h3>Check your email</h3>
              <p className="p14">We sent a 6-digit code to your email</p>
            </div>
            <Suspense fallback={<Loading />}>
              <FromVerification />
            </Suspense>

            <p className="p14 text-center mt-5 w-full">
              back to
              <Link
                href="/signup"
                className=" text-title-secondary hover:underline"
              >
                create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyPage;
