import React, { useState, KeyboardEvent } from 'react';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

type Plan = {
  id: 'basic' | 'pro' | 'vip';
  name: string;
  price: string;
  features: string[];
  color: string; // chỉ dùng cho viền phụ
  popular?: boolean;
  ribbonColor?: string;
};

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Organizer Basic',
    price: '200.000đ',
    features: ['Tạo sự kiện cơ bản', 'Quản lý đăng ký', 'Hỗ trợ email'],
    color: 'from-[#bde9e4] to-[#d6f5ef]',
  },
  {
    id: 'pro',
    name: 'Organizer Pro',
    price: '350.000đ',
    features: ['Tạo sự kiện nâng cao', 'Thống kê chi tiết', 'Hỗ trợ chat trực tiếp'],
    color: 'from-[#08BAA1] to-[#0E776E]',
    popular: true,
    ribbonColor: 'bg-emerald-600',
  },
  {
    id: 'vip',
    name: 'Organizer VIP',
    price: '500.000đ',
    features: ['Tất cả tính năng Pro', 'Ưu tiên hiển thị', 'Hỗ trợ 24/7'],
    color: 'from-[#ffd88a] to-[#f7b955]',
  },
];

const PaymentUpgrade: React.FC = () => {
  const [selected, setSelected] = useState<Plan['id']>('pro');
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  const current = plans.find(p => p.id === selected)!;

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      navigate('/profile', { state: { upgraded: true, plan: selected } });
    }, 1200);
  };

  const onCardKey = (e: KeyboardEvent<HTMLDivElement>, id: Plan['id']) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected(id);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Nâng cấp tài khoản Organizer</h1>
          <p className="mt-2 text-white/90">
            Chọn gói phù hợp để mở khóa tính năng tổ chức sự kiện chuyên nghiệp.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          role="radiogroup"
          aria-label="Chọn gói nâng cấp"
        >
          {plans.map((plan) => {
            const isActive = selected === plan.id;
            return (
              <div
                key={plan.id}
                role="radio"
                aria-checked={isActive}
                tabIndex={0}
                onKeyDown={(e) => onCardKey(e, plan.id)}
                onClick={() => setSelected(plan.id)}
                className={[
                  'group relative rounded-2xl p-[1px] transition-transform focus:outline-none',
                  'hover:-translate-y-0.5',
                  isActive ? 'ring-2 ring-[#08BAA1]/60' : 'ring-1 ring-neutral-200',
                  'bg-gradient-to-br',
                  plan.color,
                ].join(' ')}
              >
                {/* ribbon popular */}
                {plan.popular && (
                  <div className={`absolute -top-3 right-3 ${plan.ribbonColor} text-white text-xs font-semibold rounded-full px-3 py-1 shadow`}>
                    Phổ biến
                  </div>
                )}

                <div className="rounded-2xl bg-white p-6 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                    <div
                      className={[
                        'h-5 w-5 rounded-full border-2',
                        isActive ? 'border-[#08BAA1] bg-[#08BAA1]' : 'border-neutral-300 bg-white',
                      ].join(' ')}
                      aria-hidden
                    />
                  </div>

                  <div className="mt-2 text-3xl font-extrabold text-[#023334]">{plan.price}</div>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-neutral-700">
                        <svg className="mt-0.5 h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    className={[
                      'mt-6 w-full rounded-xl',
                      isActive ? 'bg-[#08BAA1] text-white' : 'bg-neutral-100 text-neutral-700',
                    ].join(' ')}
                    disabled={isActive}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(plan.id);
                    }}
                  >
                    {isActive ? 'Đã chọn' : 'Chọn gói này'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-neutral-900">Quyền lợi khi nâng cấp</h4>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-neutral-700">
              <li>• Tạo sự kiện không giới hạn</li>
              <li>• Quản lý đăng ký & tham dự chuyên sâu</li>
              <li>• Tối ưu hiển thị sự kiện đến đúng đối tượng</li>
              <li>• Hỗ trợ vận hành & báo cáo</li>
            </ul>
            <p className="mt-4 text-sm text-neutral-500">
              Bạn có thể thay đổi gói bất kỳ lúc nào. Phí sẽ được tính theo chu kỳ tháng và gia hạn tự động.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-neutral-900">Tóm tắt đơn hàng</h4>
            <div className="mt-3 flex items-center justify-between text-neutral-700">
              <span>Gói đã chọn</span>
              <span className="font-medium">{current.name}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-neutral-700">
              <span>Giá</span>
              <span className="font-semibold">{current.price}/tháng</span>
            </div>
            <div className="my-4 h-px bg-neutral-200" />
            <Button
              className="w-full py-3 rounded-xl font-semibold bg-[#08BAA1] text-white"
              loading={isPaying}
              onClick={handlePay}
            >
              Thanh toán & nâng cấp
            </Button>
            <p className="mt-3 text-center text-xs text-neutral-500">
              Bằng việc tiếp tục, bạn đồng ý với Điều khoản & Chính sách.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentUpgrade;
