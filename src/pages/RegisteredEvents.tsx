import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { featuredEvents } from '@/data/featuredEvents';

type SimpleEvent = {
  id: string;
  title: string;
  startAt: string;
  image?: string;             // preview ảnh (nếu có)
  locationText?: string;      // nơi diễn ra (nếu có)
};

const fallbackImg = (id: string) =>
  `https://images.unsplash.com/photo-1515165562835-c3b8c8c7a0b5?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=&sat=-30&exp=10&blend=023334&blend-mode=multiply&mark-align=center&mark=${encodeURIComponent(
    `https://i.pravatar.cc/64?u=${id}`
  )}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`relative whitespace-nowrap py-3 px-2 md:px-3 font-medium text-sm outline-none transition
      ${active ? 'text-[#08BAA1]' : 'text-neutral-600 hover:text-neutral-800'}
    `}
  >
    {children}
    <span
      className={`absolute left-0 right-0 -bottom-px h-[2.5px] rounded-full transition
        ${active ? 'bg-[#08BAA1]' : 'bg-transparent'}
      `}
    />
  </button>
);

const Badge: React.FC<{ children: React.ReactNode; tone?: 'primary' | 'neutral' }> = ({
  children,
  tone = 'neutral',
}) => {
  const cls =
    tone === 'primary'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-neutral-100 text-neutral-700 ring-neutral-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cls}`}>
      {children}
    </span>
  );
};

const EventRow: React.FC<{
  event: SimpleEvent;
  trailing?: React.ReactNode;
  to: string;
  state?: any;
}> = ({ event, trailing, to, state }) => {
  const img = event.image || fallbackImg(event.id);
  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-3 md:p-4 shadow-sm hover:shadow-md transition">
      <Link to={to} state={state} className="flex items-center gap-3 md:gap-4">
        <img
          src={img}
          alt={event.title}
          className="h-16 w-24 md:h-20 md:w-28 rounded-lg object-cover border border-neutral-200"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="truncate text-base md:text-lg font-semibold text-neutral-900">{event.title}</h3>
            {trailing}
          </div>
          <div className="mt-1 text-sm text-neutral-600 flex items-center gap-2">
            <span>{formatDate(event.startAt)}</span>
            {event.locationText && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="truncate">{event.locationText}</span>
              </>
            )}
          </div>
        </div>
        <svg className="h-5 w-5 shrink-0 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </li>
  );
};

const Empty: React.FC<{ title: string; desc: string; cta?: React.ReactNode }> = ({ title, desc, cta }) => (
  <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
      <svg className="h-6 w-6 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
    <p className="mt-1 text-neutral-600">{desc}</p>
    {cta && <div className="mt-4">{cta}</div>}
  </div>
);

const RegisteredEvents: React.FC = () => {
  // Demo data
  // Demo: lấy từ featuredEvents
  const [registeredEvents] = useState<SimpleEvent[]>([
    featuredEvents[0], // e1
    featuredEvents[1], // e2
  ].map(e => ({
    id: e.id,
    title: e.title,
    startAt: `${e.date}T${e.time}:00`,
    image: e.image,
    locationText: e.location,
  })));
  const [favoritedEvents] = useState<SimpleEvent[]>([
    featuredEvents[2], // e3
  ].map(e => ({
    id: e.id,
    title: e.title,
    startAt: `${e.date}T${e.time}:00`,
    image: e.image,
    locationText: e.location,
  })));
  const [depositedEvents] = useState<SimpleEvent[]>([
    featuredEvents[0], // e1
    featuredEvents[4], // e5 (Photography Workshop)
  ].map(e => ({
    id: e.id,
    title: e.title,
    startAt: `${e.date}T${e.time}:00`,
    image: e.image,
    locationText: e.location,
  })));

  const [activeTab, setActiveTab] = useState<'registered' | 'favorited' | 'deposited'>('registered');
  const [query, setQuery] = useState('');

  const lists = {
    registered: registeredEvents,
    favorited: favoritedEvents,
    deposited: depositedEvents,
  } as const;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lists[activeTab].filter((e) => !q || e.title.toLowerCase().includes(q));
  }, [lists, activeTab, query]);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header theo tone brand */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Sự kiện của tôi</h1>
          <p className="mt-1 text-white/90">Quản lý các sự kiện bạn đã đăng ký, yêu thích và đặt cọc.</p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        {/* Controls */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Tabs */}
            <nav className="flex gap-6 border-b border-neutral-200 md:border-none" aria-label="Tabs">
              <TabButton active={activeTab === 'registered'} onClick={() => setActiveTab('registered')}>
                Đã đăng ký
              </TabButton>
              <TabButton active={activeTab === 'favorited'} onClick={() => setActiveTab('favorited')}>
                Đã yêu thích
              </TabButton>
              <TabButton active={activeTab === 'deposited'} onClick={() => setActiveTab('deposited')}>
                Đã đặt cọc
              </TabButton>
            </nav>

            {/* Search */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                placeholder="Tìm theo tên sự kiện…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input h-10 w-[min(320px,90vw)]"
                aria-label="Tìm kiếm sự kiện"
              />
            </div>
          </div>
        </div>

        {/* Lists */}
        <div className="mt-4">
          {filtered.length === 0 ? (
            <Empty
              title="Không có sự kiện nào"
              desc="Thử đổi tab hoặc điều chỉnh từ khóa tìm kiếm."
              cta={
                <Link to="/events">
                  <Button className="rounded-xl">Khám phá sự kiện</Button>
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3">
              {filtered.map((e) => {
                // Đích đến khác nhau với danh sách đặt cọc
                const to = activeTab === 'deposited' ? '/registered-ticket' : `/events/${e.id}`;
                const trailing =
                  activeTab === 'deposited' ? (
                    <Badge tone="primary">Đã đặt cọc</Badge>
                  ) : activeTab === 'favorited' ? (
                    <Badge>Yêu thích</Badge>
                  ) : null;

                return <EventRow key={e.id} event={e} to={to} state={activeTab === 'deposited' ? { event: e } : undefined} trailing={trailing} />;
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegisteredEvents;
