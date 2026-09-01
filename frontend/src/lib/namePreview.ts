const namePreview = (name: string) => {
  const avatarColors = [
    'bg-[#00966d]',
    'bg-[#256d5b]',
    'bg-[#2563eb]',
    'bg-[#6d4fc2]',
    'bg-[#b04a76]',
    'bg-[#c47f2c]',
    'bg-[#218c8c]',
    'bg-[#5273a8]',
  ];

  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const color = avatarColors[hash % avatarColors.length];

  return {
    color,
    name: name.slice(0, 2).toUpperCase(),
  };
};

export default namePreview;


 
   
 
   

 
 
