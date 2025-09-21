import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { UserProfile, UpdateProfileDto } from '@/types/profile';
import { useToast } from '@/components/common/useToast';
import Button from '@/components/common/Button';

// Cho phép URL rỗng để không chặn khi dùng file
const profileSchema = z.object({
  displayName: z.string().min(1, 'Tên hiển thị là bắt buộc').max(50, 'Tên hiển thị quá dài'),
  avatarUrl: z.string().url('URL ảnh không hợp lệ').or(z.literal('')).optional(),
  city: z.string().max(100, 'Tên thành phố quá dài').optional(),
  bio: z.string().max(500, 'Giới thiệu quá dài').optional(),
  interests: z.string().optional(),
});

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

const MAX_FILE_MB = 5;

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate, onCancel }) => {
  const toast = useToast();

  // local state cho upload/preview
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatarUrl || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false); // chỉ cho nhập URL khi chưa chọn file
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileDto>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      avatarUrl: '',
      city: '',
      bio: '',
      interests: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl || '',
        city: profile.city || '',
        bio: profile.bio || '',
        interests: profile.interests ? profile.interests.join(', ') : '',
      });
      setAvatarPreview(profile.avatarUrl || '');
      setAvatarFile(null);
      setShowUrlInput(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, reset]);

  // cleanup blob URL khi đổi ảnh / unmount
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.showToast('Vui lòng chọn file ảnh (PNG/JPG/WebP...)', 'error');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.showToast(`Ảnh quá lớn (>${MAX_FILE_MB}MB). Vui lòng chọn ảnh nhỏ hơn.`, 'error');
      return;
    }
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    const blobUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(blobUrl);
    setShowUrlInput(false);       // Ẩn ô URL khi đã có file
    setValue('avatarUrl', '');    // Clear URL trong form để tránh nhầm
    toast.showToast('Đã chọn ảnh đại diện mới (demo)', 'success');
  };

  const removeLocalAvatar = () => {
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(profile.avatarUrl || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    // Cho phép dùng lại URL nếu muốn
    setShowUrlInput(true);
    setValue('avatarUrl', profile.avatarUrl || '');
  };

  const onSubmit = (data: any) => {
    const updated: UpdateProfileDto = {
      ...data,
      interests: data.interests ? data.interests.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };

    // Ưu tiên ảnh file; nếu có file thì không cần URL
    const finalAvatarUrl = avatarFile
      ? avatarPreview  // demo: dùng blob URL. Thực tế: upload -> lấy URL thật.
      : (updated.avatarUrl || profile.avatarUrl || '');

    const merged: UserProfile = { ...profile, ...updated, avatarUrl: finalAvatarUrl };

    toast.showToast('Cập nhật hồ sơ thành công! (demo)', 'success');
    onUpdate(merged);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa hồ sơ</h2>

      {/* Avatar + actions */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          <img
            src={avatarPreview || `https://i.pravatar.cc/160?u=${profile?.id || 'me'}`}
            alt="Avatar preview"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border border-neutral-200 shadow-sm"
            onClick={handleAvatarClick}
            role="button"
          />
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 translate-x-1 translate-y-1 rounded-full bg-primary-600 text-white p-2 shadow hover:bg-primary-700 focus:outline-none"
            title="Đổi ảnh đại diện"
            aria-label="Đổi ảnh đại diện"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 5a1 1 0 01.894.553l.724 1.447H16a1 1 0 01.894.553L18 9h1a1 1 0 011 1v8a2 2 0 01-2 2H6a2 2 0 01-2-2V10a1 1 0 011-1h1l1.106-2.447A1 1 0 017 6h2.382l.724-1.447A1 1 0 0111 4h1zM7 12a3 3 0 106 0 3 3 0 00-6 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 text-sm text-neutral-600">
          {!avatarFile ? (
            <>
              <p className="mb-2">Nhấp vào ảnh để chọn file mới. Hỗ trợ PNG/JPG/WebP, tối đa {MAX_FILE_MB}MB.</p>
              <div className="flex items-center gap-3">
                {!showUrlInput && (
                  <button
                    type="button"
                    className="text-primary-600 hover:underline"
                    onClick={() => setShowUrlInput(true)}
                  >
                    Hoặc nhập URL thay thế
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-neutral-700">Đã chọn file mới.</span>
              <Button type="button" variant="outline" size="sm" onClick={removeLocalAvatar}>
                Huỷ ảnh mới
              </Button>
            </div>
          )}
          {/* input file ẩn */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">Tên hiển thị</label>
          <input
            id="displayName"
            {...register('displayName')}
            className={`input ${errors.displayName ? 'input-error' : ''}`}
          />
          {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>}
        </div>

        {/* Chỉ hiển thị ô URL khi CHƯA chọn file & user chọn "Nhập URL thay thế" */}
        {!avatarFile && showUrlInput && (
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-700 mb-1">
              Ảnh đại diện (URL)
            </label>
            <input
              id="avatarUrl"
              {...register('avatarUrl')}
              className={`input ${errors.avatarUrl ? 'input-error' : ''}`}
              placeholder="https://..."
            />
            {errors.avatarUrl && <p className="text-red-500 text-sm mt-1">{errors.avatarUrl.message}</p>}
            <p className="text-xs text-neutral-500 mt-1">
              Bạn có thể dán URL ảnh, hoặc nhấp vào avatar ở trên để tải ảnh từ máy.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">Thành phố</label>
          <input
            id="city"
            {...register('city')}
            className={`input ${errors.city ? 'input-error' : ''}`}
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">Giới thiệu</label>
          <textarea
            id="bio"
            rows={4}
            {...register('bio')}
            className={`input ${errors.bio ? 'input-error' : ''}`}
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-neutral-700 mb-1">Sở thích (cách nhau bởi dấu phẩy)</label>
          <input
            id="interests"
            {...register('interests')}
            className="input"
            placeholder="Ví dụ: hiking, boardgame, photography"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
