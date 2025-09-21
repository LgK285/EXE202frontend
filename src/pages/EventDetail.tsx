import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { featuredEvents } from '@/data/featuredEvents';
import { eventComments } from '@/data/eventComments';
import { mockUsers } from '@/data/mockUsers';
import { useToast } from '@/components/common/useToast';

type CommentType = { id: string; user: string; content: string };

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  let event = featuredEvents.find(e => e.id === id);
  // Nếu là sự kiện vừa tạo (evt-), lấy từ location.state
  if (!event && id?.startsWith('evt-') && (location as any).state?.event) {
    event = (location as any).state.event;
  }

  const [isRegistered, setIsRegistered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const initialComments: CommentType[] =
    (eventComments as Record<string, CommentType[]>)[id!] || [];
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [rating, setRating] = useState(0);

  if (!event) {
    return <div className="text-center py-20 text-red-500">Không tìm thấy sự kiện.</div>;
  }

  const displayPrice =
    typeof event.price === 'number'
      ? event.price === 0
        ? 'Miễn phí'
        : `${Number(event.price).toLocaleString('vi-VN')}đ`
      : 'Thương lượng';

  const handleRegister = () => {
    // Chuyển sang trang thanh toán, truyền event qua state
    navigate('/event-payment', { state: { event } });
  };

  const handleFavorite = () => setIsFavorited(prev => !prev);

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: `c${prev.length + 1}`,
        user: mockUsers[0]?.name || 'Demo User',
        content: commentInput.trim(),
      },
    ]);
    setCommentInput('');
  };

  return (
    <main className="flex-1 bg-neutral-50">
      {/* HERO COVER — ảnh luôn đúng tỷ lệ, overlay gradient đẹp */}
      <section className="relative w-full">
        <div className="aspect-[21/9] w-full md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden">
          <img
            src={event.image || 'https://via.placeholder.com/1600x600'}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h20V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM22 9H2v11a2 2 0 002 2h16a2 2 0 002-2V9z" />
                </svg>
                {event.date} • {event.time}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                {event.location}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                💸 {displayPrice}
              </span>
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        {/* ACTION BAR */}
        <div className="mt-10 rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://lh3.googleusercontent.com/a/ACg8ocLQOcshE5HsZ9rb0pH2rTL3pDkXt5PE9BijawnXbXKBAkCjHQku=s288-c-no?u=${event.id}`}
              alt="Organizer"
              className="h-12 w-12 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <p className="text-xs text-neutral-500">Tổ chức bởi</p>
              <p className="font-semibold text-neutral-900">Khánh Gia</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRegister}
              className="rounded-xl !bg-[#08BAA1] hover:!bg-[#0E9E8A] !text-white !font-semibold"
            >
              Đăng ký ngay
            </Button>

            <Button
              variant="outline"
              onClick={handleFavorite}
              aria-pressed={isFavorited}
              className={`rounded-xl !px-3 !py-2 border ${
                isFavorited ? 'border-red-500 text-red-500' : 'text-neutral-600'
              }`}
              title={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* ==== 2 CỘT: TRÁI (mô tả + info) / PHẢI (đánh giá + bình luận) ==== */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mô tả sự kiện */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Mô tả sự kiện</h3>
              <p className="text-neutral-700 leading-7 whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Quick info 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-[#08BAA1] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a4 4 0 118 0v4M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm text-neutral-500">Thời gian</div>
                    <div className="font-medium text-neutral-900">
                      {event.date} • {event.time}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-[#08BAA1] mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z" />
                  </svg>
                  <div>
                    <div className="text-sm text-neutral-500">Địa điểm</div>
                    <div className="font-medium text-neutral-900">{event.location}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-[#08BAA1] mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1a9 9 0 00-9 9c0 7 9 13 9 13s9-6 9-13a9 9 0 00-9-9zm0 6a3 3 0 110 6 3 3 0 010-6z" />
                  </svg>
                  <div>
                    <div className="text-sm text-neutral-500">Giá vé</div>
                    <div className="font-medium text-neutral-900">{displayPrice}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-[#08BAA1] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a5 5 0 019.288 0" />
                  </svg>
                  <div>
                    <div className="text-sm text-neutral-500">Số người tham gia</div>
                    <div className="font-medium text-neutral-900">
                      {event.participants} / {event.maxParticipants ?? 'Không giới hạn'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Đánh giá sự kiện</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl transition-transform ${
                      star <= rating ? 'text-yellow-400' : 'text-neutral-300'
                    } hover:scale-110`}
                    onClick={() => setRating(star)}
                    aria-label={`Đánh giá ${star} sao`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-1 text-neutral-600">
                  {rating > 0 ? `Bạn đã đánh giá ${rating} sao` : 'Chưa đánh giá'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Bình luận</h3>
              <div className="space-y-4 mb-4">
                {comments.map(c => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center font-semibold text-neutral-700">
                      {c.user?.[0] ?? 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">{c.user}</div>
                      <div className="text-neutral-700">{c.content}</div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-neutral-500 italic">
                    Hãy là người đầu tiên bình luận về sự kiện này!
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Viết bình luận..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                />
                <Button onClick={handleAddComment} className="rounded-xl !px-5">
                  Gửi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventDetail;
