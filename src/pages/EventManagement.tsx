import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { featuredEvents } from '@/data/featuredEvents';
import Button from '@/components/common/Button';
import { useToast } from '@/components/common/useToast';

interface OrganizedEvent {
  id: string;
  title: string;
  description?: string;
  image?: string;
  status: 'Draft' | 'Published' | 'Closed' | 'Cancelled';
  startAt: string;
  _count: { registrations: number };
  depositCount?: number;
  confirmedCount?: number;
}

const statusStyle: Record<
  OrganizedEvent['status'],
  { bg: string; text: string; ring: string }
> = {
  Published: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  Draft:     { bg: 'bg-neutral-100', text: 'text-neutral-700', ring: 'ring-neutral-200' },
  Closed:    { bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  Cancelled: { bg: 'bg-rose-50',    text: 'text-rose-700',    ring: 'ring-rose-200' },
};

/* -------------------------- Stats Modal -------------------------- */
type StatsModalProps = {
  event: OrganizedEvent | null;
  onClose: () => void;
  depositUnit?: number; // tiền cọc mỗi người (đ) – demo
};

const StatsModal: React.FC<StatsModalProps> = ({ event, onClose, depositUnit = 50000 }) => {
  const escHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!event) return;
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, [event, escHandler]);

  if (!event) return null;

  const total = event._count?.registrations ?? 0;
  const deposits = event.depositCount ?? 0;
  const confirmed = event.confirmedCount ?? 0;

  const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);
  const depositPct = pct(deposits, total);
  const confirmedPct = pct(confirmed, total);
  const totalDepositMoney = deposits * depositUnit;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Card */}
      <div className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10
                      animate-[fadeIn_200ms_ease-out]">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-[#023334] to-[#08BAA1] px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="stats-title" className="text-2xl font-bold text-white drop-shadow">
                Thống kê sự kiện
              </h2>
              <p className="mt-1 text-white/85 line-clamp-1">{event.title}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Đóng thống kê"
              className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/10"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="text-sm text-neutral-500">Tổng đăng ký</div>
              <div className="mt-1 text-2xl font-bold text-neutral-900">{total.toLocaleString('vi-VN')}</div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="text-sm text-neutral-500">Tiền cọc thu được</div>
              <div className="mt-1 text-2xl font-bold text-neutral-900">
                {totalDepositMoney.toLocaleString('vi-VN')}đ
              </div>
              <div className="mt-1 text-xs text-neutral-500">({depositUnit.toLocaleString('vi-VN')}đ/người)</div>
            </div>
          </div>

          {/* Progress blocks */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deposit */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-neutral-900">Đã đặt cọc</div>
                <div className="text-sm text-neutral-600">
                  {deposits.toLocaleString('vi-VN')} / {total.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-neutral-100">
                <div
                  className="h-2 rounded-full bg-[#08BAA1]"
                  style={{ width: `${Math.min(depositPct, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-neutral-600">{depositPct}%</div>
            </div>

            {/* Confirmed */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-neutral-900">Đã xác nhận tham gia</div>
                <div className="text-sm text-neutral-600">
                  {confirmed.toLocaleString('vi-VN')} / {total.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-neutral-100">
                <div
                  className="h-2 rounded-full bg-[#0B7E72]"
                  style={{ width: `${Math.min(confirmedPct, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-neutral-600">{confirmedPct}%</div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} className="rounded-xl">Đóng</Button>
          </div>
        </div>
      </div>

      {/* Simple fade-in keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
/* ------------------------ End Stats Modal ------------------------ */

const EventManagement: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [events, setEvents] = useState<OrganizedEvent[]>(
    featuredEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      image: e.image,
      status: 'Published',
      startAt: e.date,
      _count: { registrations: e.participants },
      depositCount: Math.floor(e.participants * 0.7),   // demo
      confirmedCount: Math.floor(e.participants * 0.6), // demo
    }))
  );

  const [showStats, setShowStats] = useState<OrganizedEvent | null>(null);

  // Filters
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | OrganizedEvent['status']>('all');

  // nhận sự kiện mới từ navigate state
  useEffect(() => {
    const state = (window.history.state && (window.history.state as any).usr) || {};
    if (state?.newEvent) {
      setEvents((prev) => [state.newEvent, ...prev]);
      toast.showToast('Tạo sự kiện mới thành công!', 'success');
      window.history.replaceState({}, document.title);
    }
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const okStatus = status === 'all' ? true : e.status === status;
      const okQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [events, query, status]);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">Quản lý sự kiện</h1>
              <p className="text-white/90 mt-1">Xem, sửa và quản lý các sự kiện bạn đã tạo.</p>
            </div>
            <Button
              type="button"
              onClick={() => navigate('/events/new')}
              className="rounded-xl !bg-white !text-[#0B7E72] hover:!bg-white/90"
            >
              + Tạo sự kiện mới
            </Button>
          </div>
        </div>
      </section>

      {/* Controls + List */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 pb-10">
        {/* Controls */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input h-10 w-[min(360px,90vw)]"
                placeholder="Tìm theo tên hoặc mô tả…"
                aria-label="Tìm kiếm sự kiện"
              />
              <div className="flex items-center gap-2 p-2">
                <label htmlFor="status" className="text-sm text-neutral-600">Trạng thái</label>
                <select
                  id="status"
                  className="input h-10 p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="all">Tất cả</option>
                  <option value="Published">Công khai</option>
                  <option value="Draft">Bản nháp</option>
                  <option value="Closed">Đã đóng</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-neutral-600">
              Tổng: <span className="font-medium text-neutral-800">{filtered.length}</span> sự kiện
            </div>
          </div>
        </div>

        {/* Empty state / List */}
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-neutral-900">Chưa có sự kiện phù hợp</h3>
            <p className="mt-1 text-neutral-600">Thử điều chỉnh bộ lọc hoặc tạo mới một sự kiện.</p>
            <div className="mt-4">
              <Button className="rounded-xl" onClick={() => navigate('/events/new')}>Tạo sự kiện đầu tiên</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-6 hidden md:block rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Sự kiện</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Ngày diễn ra</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Đăng ký</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filtered.map((e) => {
                    const style = statusStyle[e.status];
                    return (
                      <tr key={e.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={e.image || 'https://via.placeholder.com/64x64'}
                              alt={e.title}
                              className="h-10 w-16 rounded-md object-cover border border-neutral-200"
                            />
                            <div>
                              <div className="font-medium text-neutral-900">{e.title}</div>
                              <div className="text-sm text-neutral-500 line-clamp-1">{e.description || '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-700">
                          {new Date(e.startAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-700">
                          {e._count?.registrations ?? 0}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className="inline-flex items-center gap-3">
                            <Link to={`/events/${e.id}`} state={{ event: e }} className="text-[#0B7E72] hover:underline">Xem</Link>
                            <span className="text-neutral-300">•</span>
                            <Link to={`/events/edit/${e.id}`} className="text-neutral-700 hover:underline">Sửa</Link>
                            <span className="text-neutral-300">•</span>
                            <button
                              type="button"
                              className="text-primary-700 hover:underline font-medium"
                              onClick={() => setShowStats(e)}
                            >
                              Thống kê
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mt-6 grid gap-4 md:hidden">
              {filtered.map((e) => {
                const style = statusStyle[e.status];
                return (
                  <div key={e.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={e.image || 'https://via.placeholder.com/64x64'}
                        alt={e.title}
                        className="h-16 w-24 rounded-md object-cover border border-neutral-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-neutral-900 truncate">{e.title}</h3>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}>
                            {e.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{e.description || '—'}</p>
                        <div className="mt-2 flex items-center justify-between text-sm text-neutral-700">
                          <span>{new Date(e.startAt).toLocaleDateString('vi-VN')}</span>
                          <span>{e._count?.registrations ?? 0} đăng ký</span>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <Link to={`/events/${e.id}`} state={{ event: e }} className="text-[#0B7E72] font-medium">Xem</Link>
                          <Link to={`/events/edit/${e.id}`} className="text-neutral-700 font-medium">Sửa</Link>
                          <button
                            type="button"
                            className="text-primary-700 font-medium"
                            onClick={() => setShowStats(e)}
                          >
                            Thống kê
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Single modal instance mounted once, outside table/map */}
      <StatsModal event={showStats} onClose={() => setShowStats(null)} />
    </div>
  );
};

export default EventManagement;
