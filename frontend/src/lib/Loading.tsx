import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading = ({
  message = 'Please wait while we fetch your content.',
  className = '',
}: LoadingProps) => {
  return (
    <section
      className={`p-5 min-h-[50vh] flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-md border border-border rounded-xl overflow-hidden">
        <div className="bg-card p-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-title-secondary rounded-full flex items-center justify-center">
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
          <h5>Loading...</h5>
          <p className="text-sm text-center">{message}</p>
        </div>
      </div>
    </section>
  );
};

export default Loading;
