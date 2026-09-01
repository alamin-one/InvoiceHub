const SectionBar = ({
  className,
  title,
  description,
}: {
  className?: string;
  title: string;
  description: string;
  }) => {
  
  return (
    <div className={`mb-5 ${className}`}>
      <h2 className="leading-[1.2em]"> {title} </h2>
      <p> {description}</p>
    </div>
  );
};

export default SectionBar;
