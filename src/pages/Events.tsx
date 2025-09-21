import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { featuredEvents } from '@/data/featuredEvents';

type FE = typeof featuredEvents[number];

const toVND = (p?: number | null) =>
  typeof p === 'number' ? (p === 0 ? 'Miễn phí' : `${p.toLocaleString('vi-VN')}đ`) : 'Thương lượng';

const Header: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
    <div className="absolute inset-0 bg-white/5" />
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-display font-bold">Khám phá sự kiện</h1>
      <p className="mt-2 text-white/90">Tìm kiếm và tham gia các sự kiện phù hợp với bạn</p>
    </div>
  </section>
);

const Badge: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'primary' }> = ({ children, tone = 'neutral' }) => {
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

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<'all' | 'free' | 'low' | 'medium' | 'high'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');

  // 👉 Khi mount trang /events: cuộn lên đầu ngay lập tức
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // options (an toàn khi field rỗng)
  const eventTypes = useMemo(() => {
    const set = new Set<string>();
    featuredEvents.forEach(e => e.type && set.add(e.type));
    return ['all', ...Array.from(set)];
  }, []);
  const vibes = useMemo(() => {
    const set = new Set<string>();
    featuredEvents.forEach(e => e.vibe && set.add(e.vibe));
    return ['all', ...Array.from(set)];
  }, []);

  // lọc
  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return featuredEvents.filter(event => {
      const inSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        (event.description || '').toLowerCase().includes(q);
      if (!inSearch) return false;

      if (selectedType !== 'all' && event.type !== selectedType) return false;
      if (selectedVibe !== 'all' && event.vibe !== selectedVibe) return false;

      const price = typeof event.price === 'number' ? event.price : null;
      if (selectedPrice === 'free' && price !== 0) return false;
      if (selectedPrice === 'low' && !(price !== null && price > 0 && price < 100000)) return false;
      if (selectedPrice === 'medium' && !(price !== null && price >= 100000 && price <= 500000)) return false;
      if (selectedPrice === 'high' && !(price !== null && price > 500000)) return false;

      return true;
    });
  }, [searchTerm, selectedPrice, selectedType, selectedVibe]);

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Header />

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 pb-10">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-3">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tìm kiếm</label>
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm sự kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input h-10 pl-10"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Loại sự kiện</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input h-10 p-2"
              >
                {eventTypes.map(t => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'Tất cả' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Vibe */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Vibe</label>
              <select
                value={selectedVibe}
                onChange={(e) => setSelectedVibe(e.target.value)}
                className="input h-10 p-2"
              >
                {vibes.map(v => (
                  <option key={v} value={v}>
                    {v === 'all' ? 'Tất cả' : v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Mức giá</label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value as any)}
                className="input h-10 p-2"
              >
                <option value="all">Tất cả</option>
                <option value="free">Miễn phí</option>
                <option value="low">Dưới 100k</option>
                <option value="medium">100k - 500k</option>
                <option value="high">Trên 500k</option>
              </select>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4 text-sm text-neutral-600">
            Tìm thấy <span className="font-medium text-neutral-800">{filteredEvents.length}</span> sự kiện
          </div>
        </div>

        {/* List */}
        {filteredEvents.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition animate-slide-up"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <Link
                  to={`/events/${event.id}`}
                  className="block group"
                  // 👉 Cuộn mượt lên đầu khi vào trang chi tiết
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        event.image ||
                        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'
                      }
                      alt={event.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* overlay + badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute left-3 right-3 bottom-3 flex items-center gap-2">
                      {event.type && <Badge tone="primary">{event.type}</Badge>}
                      {event.vibe && <Badge>#{event.vibe}</Badge>}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-neutral-900 truncate">{event.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{event.description}</p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-bold text-[#08BAA1]">{toVND(event.price as FE['price'])}</span>
                      <span className="inline-flex items-center gap-1 text-neutral-600">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                        </svg>
                        {event.date}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <svg className="h-6 w-6 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Không tìm thấy sự kiện</h3>
            <p className="mt-1 text-neutral-600">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
