import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '@/types/profile';
import Button from '@/components/common/Button';
import { useToast } from '@/components/common/useToast';

interface ProfileDetailProps {
  profile: UserProfile;
  onEdit: () => void;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const roleStyleMap: Record<string, { bg: string; text: string; ring: string }> = {
  organizer:   { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  admin:       { bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  participant: { bg: 'bg-neutral-100',text: 'text-neutral-700', ring: 'ring-neutral-200' },
};

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile, onEdit, onProfileUpdate }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const roleKey = (profile.role || 'participant').toLowerCase();
  const roleStyle = roleStyleMap[roleKey] || roleStyleMap.participant;

  // Khi thanh toán thành công
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsUpgrading(true);
    setTimeout(() => {
      onProfileUpdate({ ...profile, role: 'organizer' });
      toast.showToast('Nâng cấp tài khoản thành công! (demo)', 'success');
      setIsUpgrading(false);
    }, 800);
  };

  const avatarSrc =
    profile.avatarUrl && profile.avatarUrl.trim() !== ''
      ? profile.avatarUrl
      : `https://i.pravatar.cc/200?u=${profile.id || profile.email || 'user'}`;

  return (
    <section className="overflow-visible rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* COVER */}
      <div className="relative h-36 w-full bg-gradient-to-r from-[#023334] to-[#08BAA1] z-0">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,white,transparent_40%)] pointer-events-none" />
      </div>

      {/* STRIP */}
      <div className="px-5 sm:px-8 -mt-12 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          <div className="shrink-0">
            <img
              src={avatarSrc}
              alt={profile.displayName}
              className={`mb-6 h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ${roleStyle.ring} shadow-md border border-white/40`}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-200">
                  {profile.displayName}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-neutral-900 break-all">{profile.email}</span>
                  {profile.city && <span className="text-neutral-600">📍 {profile.city}</span>}
                </div>

                <div className="mt-3 inline-flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}
                    title="Vai trò"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6l7 4v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8l7-4z" />
                    </svg>
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Actions: giữ layout cố định */}
              <div className="flex gap-2 flex-none min-w-[320px] justify-end">
                <Button
                  onClick={onEdit}
                  className="mt-6 rounded-xl h-10 whitespace-nowrap px-4 "
                >
                  Chỉnh sửa hồ sơ
                </Button>

                {/* Nút nâng cấp luôn render để giữ kích thước; khi đã organizer -> disabled & đổi nhãn */}
                <Button
                  onClick={() => {
                    if (roleKey === 'participant') navigate('/payment-upgrade');
                  }}
                  loading={isUpgrading}
                  disabled={isUpgrading || roleKey !== 'participant'}
                  className={`mt-6 rounded-xl h-10 whitespace-nowrap px-4"
                  ${roleKey !== 'participant' ? '!bg-white !text-neutral-700 !border !border-neutral-300' : ''}`}
                >
                  {roleKey === 'participant' ? 'Nâng cấp Organizer' : 'Đã là Organizer'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Email</div>
            <div className="mt-1 font-medium text-neutral-800 break-all">{profile.email}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Thành phố</div>
            <div className="mt-1 font-medium text-neutral-800">{profile.city || '—'}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Vai trò</div>
            <div className="mt-1 font-medium text-neutral-800 capitalize">{profile.role}</div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-neutral-900">Giới thiệu</h3>
              <p className="mt-3 text-neutral-700 whitespace-pre-wrap">
                {profile.bio && profile.bio.trim() !== '' ? profile.bio : 'Chưa có giới thiệu.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-neutral-900">Sở thích</h3>
              {profile.interests && profile.interests.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <span
                      key={`${interest}-${idx}`}
                      className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-neutral-600">Chưa cập nhật sở thích.</p>
              )}
            </div>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </section>
  );
};

export default ProfileDetail;
