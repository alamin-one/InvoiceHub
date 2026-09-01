import Link from 'next/link';
import { SearchX } from 'lucide-react';
import Button from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Link href="/dashboard">
        Go Back
        <section className="min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-md border border-border rounded-xl overflow-hidden">
            <div className="bg-card p-8 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-title-secondary rounded-full flex items-center justify-center">
                <SearchX size={28} className="text-title" />
              </div>
              <h5>Page Not Found</h5>
              <p className="text-sm text-center">
                The page you are looking for doesn&apos;t exist or has been
                moved.
              </p>
            </div>

            <div className="p-5 flex gap-3">
              <Button variant="secondary" className="flex-1">
                Go Back
              </Button>
            </div>
          </div>
        </section>
      </Link>
    </>
  );
}
