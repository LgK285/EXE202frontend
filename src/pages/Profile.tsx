import React, { useState, useEffect } from 'react';
import type { UserProfile } from '@/types/profile';
import ProfileDetail from '@/components/profile/ProfileDetail';
import ProfileForm from '@/components/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  // ...existing code...
  const [profile, setProfile] = useState<UserProfile | null>({
    id: 'u1',
    email: 'luonggiakhanh1997@gmail.com',
    displayName: 'Khanhgia',
    avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLQOcshE5HsZ9rb0pH2rTL3pDkXt5PE9BijawnXbXKBAkCjHQku=s288-c-no',
    city: 'Quy Nhơn, Bình Định',
    bio: 'Mình là một người yêu thích du lịch và khám phá những điều mới mẻ. Rất vui được kết nối với mọi người!',
    interests: ['music', 'boardgame', 'photography'],
    role: 'participant',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải hồ sơ...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">Không tìm thấy thông tin hồ sơ.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {isEditing ? (
        <ProfileForm 
          profile={profile}
          onUpdate={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileDetail 
          profile={profile} 
          onEdit={() => setIsEditing(true)} 
          onProfileUpdate={handleProfileUpdate} // Use the same handler for role upgrades
        />
      )}
    </div>
  );
};

export default ProfilePage;
