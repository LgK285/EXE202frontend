import React, { useState } from 'react';
import { User } from '@/types/user';

export interface RegistrationInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  deposited: boolean;
}

export const demoUsers: RegistrationInfo[] = [
  {
    id: 'u1', name: 'Khanhgia', email: 'luonggiakhanh1997@gmail.com', avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLQOcshE5HsZ9rb0pH2rTL3pDkXt5PE9BijawnXbXKBAkCjHQku=s288-c-no', deposited: true,
  },
  {
    id: 'u2', name: 'QuyAn2k4prodz', email: 'anhoang2004@email.com', avatar: 'https://if24h.com/wp-content/uploads/2024/10/anh-dai-dien-vo-tri.jpg', deposited: false,
  },
  { id: 'u3', name: 'Brimcanhcut', email: 'brimcanhcut2molly@email.com', avatar: 'https://yt3.googleusercontent.com/JjgIoRv_Na3Nhr2ozgrNUlmnSprY5q9Ut2QGnkIWEgX6lj1T_84GIiAKcIr7s1lEh9f3nor_WA=s900-c-k-c0x00ffffff-no-rj', deposited: true },
  { id: 'u4', name: 'Levi', email: 'Ackerman@email.com', avatar: 'https://practicaltyping.com/wp-content/uploads/2022/04/leviacker.jpg', deposited: false },
  { id: 'u5', name: 'Mycutezz', email: 'Mycuteday@email.com', avatar: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp', deposited: true },
  { id: 'u6', name: 'Danh Hoàng Thắng', email: 'ThangDanh1002@email.com', avatar: 'https://letrungpet.com/upload/product/meo-chan-ngan-mau-xam-04-3-3330.png', deposited: false },
  { id: 'u7', name: 'Horcus0', email: 'Vamos@email.com', avatar: 'https://yt3.googleusercontent.com/kdhOqnzNpfeonw42Nvo7QwiH6LJqBAMp4_cYzxJqNv11bi6zxn8ZtSosbl1tvx20-YJkWw2noQ=s900-c-k-c0x00ffffff-no-rj', deposited: true },
  { id: 'u8', name: 'T2kzzp', email: 'televi103@email.com', avatar: 'https://jbagy.me/wp-content/uploads/2025/03/Hinh-anh-avatar-nam-cute-2.jpg', deposited: false },
  { id: 'u9', name: 'Damit2k', email: 'Damit2kday@email.com', avatar: 'https://i.ytimg.com/vi/yrR988Mkqwo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBJZjy-mYbDiJWKp7KtHyDda5QIYQ', deposited: true },
  { id: 'u10', name: 'Hùng Ngọc Hiền', email: 'hhung2001@email.com', avatar: 'https://i.pinimg.com/736x/8a/38/e2/8a38e23582e139f23088f26911a4a760.jpg', deposited: false },
  { id: 'u11', name: 'Cypher', email: 'Cypher@email.com', avatar: 'https://i.pinimg.com/736x/ab/c6/05/abc605a5291caf0779fd8953aa4c58e2.jpg', deposited: true },
  { id: 'u12', name: 'MinitasyNguyen', email: 'MiniNguyenday@emaila.com', avatar: 'https://i.pinimg.com/1200x/65/a6/b1/65a6b1e427ebd1602eb779d40cb371cd.jpg', deposited: false },
  { id: 'u13', name: 'Mackenyu', email: 'maken10661@email.com', avatar: 'https://i.pinimg.com/736x/da/54/bf/da54bfdb774d87dd1ef6de5d6a509569.jpg', deposited: false},
  { id: 'u14', name: 'Lê Hoàng Nam', email: 'hoangnam@email.com', avatar: 'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg', deposited: false },
  { id: 'u15', name: 'Dothisforallday', email: 'captaincity@email.com', avatar: 'https://i.pinimg.com/736x/b5/8b/a7/b58ba78f968ad87a6f5c99d73d4d12ba.jpg', deposited: true },
  { id: 'u16', name: 'mimiboozini', email: 'phalehongdotim@email.com', avatar: 'https://i.pinimg.com/736x/52/aa/9a/52aa9a7dcf0b72fd435ce6cd526981a1.jpg', deposited: false },
  { id: 'u17', name: 'HoangVanMinh', email: 'MinhHoang1997@email.com', avatar: 'https://i.pinimg.com/736x/d3/11/f1/d311f1fad645cf23344af2c708ab683d.jpg', deposited: true },
  { id: 'u18', name: 'Nguyen Thi Lan', email: 'thilanNguyen21@email.com', avatar: 'https://i.pinimg.com/736x/e2/d3/16/e2d316da2a1aeda2699d4e98189ea79a.jpg', deposited: false },
  { id: 'u19', name: 'Tran Van Phat', email: 'vanphat@email.com', avatar: 'https://i.pinimg.com/736x/b5/63/8e/b5638ea83bc14e12fe5e1001b6fd50a4.jpg', deposited: true },
  { id: 'u20', name: 'Le Thi Dao', email: 'thidao@email.com', avatar: 'https://i.pinimg.com/736x/0e/33/a9/0e33a93788137a4caed464b51750e24f.jpg', deposited: false },
];

interface UserRegistrationPopupProps {
  registrations: RegistrationInfo[];
  onClose: () => void;
}

const UserRegistrationPopup: React.FC<UserRegistrationPopupProps> = ({ registrations, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'deposited' | 'normal'>('all');
  const [search, setSearch] = useState('');

  // Nếu không truyền registrations thì dùng demoUsers
  const data = registrations && registrations.length > 0 ? registrations : demoUsers;

  const filtered = data.filter((r) => {
    if (filter === 'deposited' && !r.deposited) return false;
    if (filter === 'normal' && r.deposited) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      if (!r.name.toLowerCase().includes(s) && !r.email.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold flex-1">Danh sách đăng ký</h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="ml-2 rounded-full p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-100 transition"
            style={{ lineHeight: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M6 6l8 8M14 6l-8 8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-300 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#08BAA1]"
            style={{ marginRight: 8 }}
          />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg border text-sm font-medium transition ${filter === 'all' ? 'bg-[#08BAA1] text-white border-[#08BAA1]' : 'bg-white text-[#08BAA1] border-[#08BAA1] hover:bg-[#08BAA1]/10'}`}
          >Tất cả</button>
          <button
            onClick={() => setFilter('deposited')}
            className={`px-3 py-1 rounded-lg border text-sm font-medium transition ${filter === 'deposited' ? 'bg-[#0B7E72] text-white border-[#0B7E72]' : 'bg-white text-[#0B7E72] border-[#0B7E72] hover:bg-[#0B7E72]/10'}`}
          >Đã đặt cọc</button>
          <button
            onClick={() => setFilter('normal')}
            className={`px-3 py-1 rounded-lg border text-sm font-medium transition ${filter === 'normal' ? 'bg-neutral-700 text-white border-neutral-700' : 'bg-white text-neutral-700 border-neutral-700 hover:bg-neutral-700/10'}`}
          >Đăng ký thường</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center text-neutral-500">Không có dữ liệu</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2">Avatar</th>
                  <th className="py-2">Tên</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">
                      <img src={user.avatar || 'https://via.placeholder.com/32'} alt={user.name} className="h-8 w-8 rounded-full" />
                    </td>
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      {user.deposited ? (
                        <span className="text-green-600 font-semibold">Đã đặt cọc</span>
                      ) : (
                        <span className="text-gray-600">Đăng ký thường</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationPopup;
