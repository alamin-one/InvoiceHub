const MiniCard = ({ title, value }: { title: string; value: string | number }) => {
  const color =
    title === 'Invoices'
      ? 'text-text'
      : title === 'Total paid'
        ? 'text-success'
        : title === 'Total due'
          ? 'text-danger'
          : 'text-warning';
 
  return (
    <div className="rounded-lg bg-background px-3 py-2.5">
      <p className="p13">{title}</p>
      <h3 className={`mt-1 text-xl md:text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
};

export default MiniCard;
