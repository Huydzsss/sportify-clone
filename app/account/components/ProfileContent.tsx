"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";

import Button from "@/components/Button";
import Input from "@/components/Input";

export const ProfileContent = () => {
  const router = useRouter();
  const { user, userDetails, isLoading } = useUser();
  const supabaseClient = useSupabaseClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      fullName: "",
      avatar: null,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: userDetails?.full_name || user.user_metadata?.full_name || "",
        avatar: null,
      });
    }
  }, [user, userDetails, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsUpdating(true);
      
      let avatarUrl = user?.user_metadata?.avatar_url || userDetails?.avatar_url || "";
      const avatarFile = values.avatar?.[0];

      if (avatarFile) {
        if (avatarFile.size > 2 * 1024 * 1024) {
          toast.error("Image file size must be less than 2MB!");
          setIsUpdating(false);
          return;
        }

        const unqId = uniqid();
        const { data: imageData, error: imageError } = await supabaseClient
          .storage
          .from("images")
          .upload(`avatar-${user?.id}-${unqId}`, avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (imageError) {
          setIsUpdating(false);
          return toast.error("Failed to upload avatar!");
        }

        const { data: publicUrlData } = supabaseClient
          .storage
          .from("images")
          .getPublicUrl(imageData.path);
          
        avatarUrl = publicUrlData.publicUrl;
      }

      const fullName = values.fullName || "";

      // 1. Update Auth Metadata so it reflects instantly on UI
      const { error: authError } = await supabaseClient.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl
        }
      });

      if (authError) {
        setIsUpdating(false);
        return toast.error("Failed to update auth metadata");
      }

      // 2. Update public.users table using upsert to avoid missing row issues
      const { error: dbError } = await supabaseClient
        .from('users')
        .upsert({
          id: user?.id,
          full_name: fullName,
          avatar_url: avatarUrl
        });

      if (dbError) {
        setIsUpdating(false);
        return toast.error("Failed to update database record");
      }

      toast.success("Profile updated successfully!");
      router.refresh();

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mb-7 px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 max-w-[400px]">
        <h3 className="text-xl font-semibold mb-2">Public Profile</h3>
        
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>
          <Input
            id="fullName"
            disabled={isUpdating || isLoading}
            {...register('fullName', { required: false })}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Avatar Image
          </label>
          <Input
            id="avatar"
            type="file"
            disabled={isUpdating || isLoading}
            accept="image/*"
            {...register('avatar')}
          />
        </div>

        <Button disabled={isUpdating || isLoading} type="submit" className="w-[150px] mt-2">
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </form>
      <hr className="border-neutral-700 mt-8 mb-4 max-w-[600px]"/>
    </div>
  );
};
