import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=freeday-demo-payment';

const EventPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = (location.state && (location.state as any).event) || null;

  if (!event) {
    return <div className="text-center py-20 text-red-500">Không tìm thấy sự kiện.</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-neutral-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary-700">Xác nhận đặt cọc & giữ chỗ</h1>
        {/* Event info */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-xl font-bold mb-2 text-[#08BAA1]">{event.title}</h2>
          <div className="mb-2 text-neutral-700">{event.description}</div>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
            <span>Thời gian: <b>{event.date} {event.time}</b></span>
            <span>Địa điểm: <b>{event.location}</b></span>
            <span>Giá vé: <b>{typeof event.price === 'number' ? `${Number(event.price).toLocaleString('vi-VN')}đ` : 'Thương lượng'}</b></span>
          </div>
        </div>
        {/* QR & payment */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <img src={QR_URL} alt="QR code demo" className="rounded-xl border-2 border-[#08BAA1]" />
          <div className="text-lg font-semibold text-[#08BAA1]">Quét mã QR để chuyển khoản đặt cọc</div>
          <div className="text-neutral-700 text-sm">Nội dung chuyển khoản: <b>FREEDAY-{event.id}</b></div>
          <div className="text-neutral-700 text-sm">Số tiền đặt cọc: <b>50.000đ</b></div>
        </div>
        <Button className="w-full py-3 rounded-xl font-bold text-lg bg-primary-600 text-white" onClick={() => navigate('/registered-ticket', { state: { event } })}>
          Tôi đã chuyển khoản, xác nhận giữ chỗ
        </Button>
        <div className="mt-6 text-center text-neutral-500 text-sm">
          Sau khi xác nhận thanh toán, chúng tôi sẽ tiến hành giữ chỗ cho bạn tại sự kiện này. 
        </div>
      </div>
    </main>
  );
};

export default EventPayment;
