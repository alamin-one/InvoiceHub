'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import Store from '@/types/store';
import Button from '../ui/button';
import Input from '../ui/input';
import Textarea from '../ui/textarea';
import handleAlert from '@/lib/handleAlert';
import { useUpdateProfileMutation } from '@/redux/feature/storeSlice';

import { Camera } from 'lucide-react';
import generateImgURL from '@/lib/cloudinary/genareteImgURL';
import { deleteCloudinaryImage } from '@/lib/cloudinary/deleteCloudinaryImage';

const StoreProfile = ({ store }: { store: Store }) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [imageData, setImageData] = useState<{
    url: string;
    public_id: string;
  } | null>(null);

  // submit profile data
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file, ...data } = Object.fromEntries(formData.entries());
    const payload = {
      ...data,
      logo: {
        url: imageData?.url || store?.logo?.url || '',
        public_id: imageData?.public_id || store?.logo?.public_id || '',
      },
    };
    try {
      const res = await updateProfile(payload).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error.data.message || error.message);
    }
  };

  // profile logo upload / delete
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 1024 * 1024 * 1;
    if (file.size > MAX_FILE_SIZE) {
      handleAlert(false, 'Image size must be less than 1MB');
      e.target.value = '';
      return;
    }

    if (imageData?.public_id) {
      try {
        await deleteCloudinaryImage(imageData.public_id);
      } catch {
        handleAlert(false, 'Failed to delete old image');
      }
    }
    const url = await generateImgURL(file);
    setImageData({ url: url.url, public_id: url.public_id });
  };

  return (
    <form onSubmit={onSubmit}>
      <h4 className=" ">Business Profile</h4>
      <p className="p13">This appears on your invoices and dashboard.</p>

      <div className="border-t border-border mt-5 pt-4 space-y-3">
        <div className="flex items-center gap-3 mb-5">
          {imageData || store?.logo?.url ? (
            <Image
              src={imageData?.url || store?.logo?.url || ''}
              alt={store?.name || ''}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          ) : (
            <div className={` w-10.5 h-10.5 rounded-full border border-text`}>
              {''}
            </div>
          )}

          <label
            htmlFor="file"
            className="flex items-center gap-2 text-xs font-medium capitalize px-2 py-1.5 border border-border rounded-md cursor-pointer"
          >
            <Camera size={14} className="text-title-secondary" />
            <input
              type="file"
              name="file"
              id="file"
              multiple={false}
              accept=".png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={e => uploadImage(e)}
            />
            Change photo
          </label>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 ">
          <Input
            label="Business Name"
            type="text"
            name="name"
            defaultValue={store.name}
            placeholder="Hafu Traders"
          />
          <Input
            name="tagline"
            label="Tagline"
            type="text"
            defaultValue={store.tagline}
            placeholder="Wholesale & Retail Supplier"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-5 ">
          <Input
            label="Email"
            type="email"
            name="email"
            defaultValue={store.email}
            placeholder="hello@novatraders.com"
          />
          <Input
            label="Phone"
            type="tel"
            name="phone"
            defaultValue={store.phone}
            placeholder="+880 1711-123456"
          />
        </div>

        <Textarea
          label="Address"
          name="address"
          defaultValue={store.address}
          placeholder="address"
        />

        <Button
          disabled={isLoading}
          loading={isLoading}
          type="submit"
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default StoreProfile;
