import { FileX2 } from 'lucide-react';

interface NotFoundProps {
  title?: string;
  message?: string;
  className?: string;
}

const NotFound = ({
  title = 'Not Found',
  message = 'The content you are looking for does not exist or has been removed.',
  className = '',
}: NotFoundProps) => {
  return (
    <section
      className={`p-5 min-h-[50vh] flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-md border border-border rounded-xl overflow-hidden">
        <div className="bg-card p-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-title-secondary rounded-full flex items-center justify-center">
            <FileX2 size={28} className="text-white" />
          </div>
          <h5>{title}</h5>
          <p className="text-sm text-center">{message}</p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
