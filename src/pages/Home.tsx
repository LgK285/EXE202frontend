import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { featuredEvents } from '@/data/featuredEvents';
import Reveal from '@/components/motion/Reveal';

const Home: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Tìm bạn đồng hành',
      description: 'Kết nối với những người có cùng sở thích và tham gia sự kiện cùng nhau.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2zm10-10V7a4 4 0 00-8 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Sự kiện đa dạng',
      description: 'Khám phá hàng trăm sự kiện thú vị từ âm nhạc, thể thao đến văn hóa.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'An toàn & bảo mật',
      description: 'Hệ thống xác thực và bảo mật thông tin cá nhân của bạn.'
    }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Thị Anh',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8vNT_8SSDnlKe0RTZXp63Ga8XMIJGWF_jFA&s',
      content: 'Freeday giúp tôi tìm được những người bạn tuyệt vời và tham gia nhiều sự kiện thú vị!',
      rating: 5
    },
    {
      name: 'Trần Văn Bình',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuK3rI4OmFZ_Wxo4YVZgRFO1a50LU5x5NsA&s',
      content: 'Nền tảng dễ dùng, nhiều sự kiện đa dạng. Tôi đã tham gia 5 sự kiện trong 2 tháng!',
      rating: 5
    },
    {
      name: 'Lê Thị Cẩm',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkijd6jm283ibpY4-fj7aroi6OzS_rVrv0gA&s',
      content: 'Từ khi dùng Freeday, tôi có thêm nhiều bạn mới và trải nghiệm đáng nhớ!',
      rating: 5
    }
  ];

  return (
    <div className="bg-neutral-50 font-sans">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <Reveal>
            <div className="mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight">
                FREEDAY
              </h1>
              <h2 className="mt-2 text-3xl md:text-5xl font-display font-bold leading-tight">
                Kết nối cộng đồng <br />
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                  Tìm bạn đồng hành
                </span>
              </h2>
              <p className="mt-6 text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Tham gia sự kiện cùng những người bạn mới. Khám phá trải nghiệm đáng nhớ và tạo kỷ niệm tuyệt vời.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events" aria-label="Khám phá sự kiện">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-[#0B7E72] hover:bg-neutral-100 rounded-2xl shadow-lg">
                    Khám phá sự kiện
                  </Button>
                </Link>
                <Link to="/forum" aria-label="Tìm bạn đồng hành">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-[#0B7E72] hover:bg-neutral-100 rounded-2xl shadow-lg">
                    Tìm bạn đồng hành
                  </Button>
                </Link>
              </div>

              {/* mini stats */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-sm">
                <div className="rounded-xl border border-white/20 bg-white/10 py-3">+500 sự kiện/tháng</div>
                <div className="rounded-xl border border-white/20 bg-white/10 py-3">+1k thành viên</div>
                <div className="rounded-xl border border-white/20 bg-white/10 py-3">95% hài lòng</div>
                <div className="rounded-xl border border-white/20 bg-white/10 py-3">Bảo mật & an toàn</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={i} delay={80 * i}>
                <div className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white shadow-md">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-neutral-900">{f.title}</h3>
                  <p className="mt-2 text-neutral-600 leading-relaxed">{f.description}</p>
                  <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#023334] to-[#08BAA1]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">Sự kiện nổi bật</h2>
                <p className="mt-2 text-lg text-neutral-600">Những sự kiện hot nhất tuần này</p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 6).map((event, index) => (
              <Reveal key={event.id} delay={90 * index}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-white/90 text-neutral-900 text-xs font-semibold px-2.5 py-1 ring-1 ring-black/10">
                        {event.type === 'music' ? 'Âm nhạc'
                          : event.type === 'sports' ? 'Thể thao'
                          : event.type === 'food' ? 'Ẩm thực'
                          : event.type === 'outdoor' ? 'Ngoài trời'
                          : event.type === 'art' ? 'Nghệ thuật'
                          : 'Giao lưu'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-white/90 text-neutral-900 text-xs font-semibold px-2.5 py-1 ring-1 ring-black/10">
                        {event.vibe === 'energetic' ? 'Năng động'
                          : event.vibe === 'creative' ? 'Sáng tạo'
                          : event.vibe === 'adventure' ? 'Phiêu lưu'
                          : 'Thư giãn'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white text-sm flex items-center justify-between">
                      <span className="font-medium">{event.participants}/{event.maxParticipants} người</span>
                      <span className="font-medium">
                        {event.price === 0 ? 'Miễn phí' : `${Number(event.price).toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">{event.title}</h3>
                    <div className="mt-3 space-y-2 text-sm text-neutral-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#08BAA1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
                        </svg>
                        {event.date} - {event.time}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#08BAA1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[#023334] font-semibold">
                        {event.price === 0 ? 'Miễn phí' : `${Number(event.price).toLocaleString('vi-VN')}đ`}
                      </span>
                      <Link to={`/events/${event.id}`}>
                        <Button size="sm" className="rounded-xl">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <Reveal>
              <Link to="/events">
                <Button variant="outline" size="lg" className="rounded-2xl">
                  Xem tất cả sự kiện
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-[#023334]">Người dùng nói gì về Freeday</h2>
                <p className="mt-2 text-lg text-neutral-700">Những chia sẻ từ cộng đồng Freeday</p>
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <Reveal key={index} delay={80 * index}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-[#08BAA1]/40">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-center mb-3" aria-label={`${t.rating} sao`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#08BAA1]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-600 mb-3 italic">“{t.content}”</p>
                  <h4 className="font-semibold text-neutral-900">{t.name}</h4>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (gần footer) – đổi màu chữ rõ ràng, không dùng inline-style */}
      <section className="py-20 bg-gradient-to-br from-[#023334] to-[#08BAA1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Reveal>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Sẵn sàng tham gia?</h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Hãy bắt đầu hành trình khám phá và kết nối ngay hôm nay!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-[#0B7E72] hover:bg-neutral-100 rounded-2xl">
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-[#0B7E72] hover:bg-neutral-100 rounded-2xl">
                    Khám phá sự kiện
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
