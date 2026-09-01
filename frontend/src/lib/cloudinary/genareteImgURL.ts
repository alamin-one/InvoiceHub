const generateImgURL = async (file: File) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_PRESET_NAME!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = await res.json();

  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
};

export default generateImgURL;
