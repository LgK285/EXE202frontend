import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { mockUsers } from '@/data/mockUsers';

const RegisteredTicket: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = (location.state && (location.state as any).event) || null;
  const user = mockUsers[0];
  const depositAmount = 50000;
  const now = new Date();

  if (!event) {
    return <div className="text-center py-20 text-red-500">Không tìm thấy sự kiện đã đặt.</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border-4 border-[#08BAA1] relative">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#08BAA1]">Vé Đặt Chỗ Sự Kiện</h1>
        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <h2 className="text-xl font-bold mb-2 text-primary-700">{event.title}</h2>
          <div className="mb-2 text-neutral-700">{event.description}</div>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-2">
            <span>Thời gian: <b>{event.date} {event.time}</b></span>
            <span>Địa điểm: <b>{event.location}</b></span>
            <span>Giá vé: <b>{typeof event.price === 'number' ? `${Number(event.price).toLocaleString('vi-VN')}đ` : 'Thương lượng'}</b></span>
          </div>
        </div>
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-5 flex flex-col gap-2">
          <div className="flex justify-between text-lg font-semibold text-primary-700">
            <span>Số tiền đã đặt cọc:</span>
            <span>{depositAmount.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Ngày giờ đặt:</span>
            <span>{now.toLocaleString('vi-VN')}</span>
          </div>
        </div>
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 flex flex-col gap-2">
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Người đặt:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Email:</span>
            <span>{user.email || 'demo@email.com'}</span>
          </div>
        </div>
        <Button className="w-full mt-2 rounded-xl !bg-[#08BAA1] !text-white font-bold text-lg" onClick={() => navigate('/events/' + event.id)}>
          Xem lại chi tiết sự kiện
        </Button>
      </div>
    </main>
  );
};

export default RegisteredTicket;
