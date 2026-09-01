import namePreview from '@/lib/namePreview';


const CustomerAbater = ({
  name,
  phone,
  address,
}: {
  name: string | null;
  phone: string | null;
  address: string | null;
}) => {
  const { color, name: avName } = namePreview(name || '');
  return (
    <div className="flex  items-start gap-3">
      <div
        className={` w-10.5 h-10.5 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase ${color}`}
      >
        {avName}
      </div>
      <div>
        <p className="text-sm font-medium text-title">{name}</p>
        <p className="text-xs">{phone}</p>
        {address && <p className="text-xs">{address}</p>}
      </div>
    </div>
  );
};

export default CustomerAbater;
