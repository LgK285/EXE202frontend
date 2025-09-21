import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { forumPosts } from '@/data/forumPosts';
import { mockUsers } from '@/data/mockUsers';
import Button from '@/components/common/Button';

type Reply = {
  id: string;
  user: typeof mockUsers[number];
  content: string;
  createdAt: string;
};

type Comment = {
  id: string;
  user: typeof mockUsers[number];
  content: string;
  createdAt: string;
  replies: Reply[];
};

const formatDateTime = (iso?: string) => {
  if (!iso) return 'N/A';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

const ForumPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = forumPosts.find((p) => p.id === postId);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      user: mockUsers.find((u) => u.id === 'u1') || {
        id: 'u1', name: 'Nguyễn Văn A', avatar: '', email: ''
      },
      content: 'Mình tham gia nhé, cho mình xin sdt mình liên hệ sau ạ',
      createdAt: '2025-09-15T09:00:00Z',
      replies: [],
    },
    {
      id: 'c2',
      user: mockUsers.find((u) => u.id === 'u2') || {
        id: 'u2',
        name: 'Hoàng Văn Hùng',
        avatar: 'https://jbagy.me/wp-content/uploads/2025/03/Hinh-anh-doremon-cute-2.jpg',
        email: '',
      },
      content: '+1 slot nha chủ tus 0935873054',
      createdAt: '2025-09-15T10:00:00Z',
      replies: [],
    },
  ]);

  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Reactions
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const likeCount = useMemo(() => (liked ? 1 : 0) + (loved ? 1 : 0), [liked, loved]);

  const currentUser = mockUsers[0];

  const totalCommentCount = useMemo(
    () => comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0),
    [comments]
  );

  if (!post) {
    return <div className="text-center py-20 text-red-500">Không tìm thấy bài đăng.</div>;
  }

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c${prev.length + 1}`,
        user: currentUser,
        content: commentInput.trim(),
        createdAt: new Date().toISOString(),
        replies: [],
      },
    ]);
    setCommentInput('');
  };

  const handleReply = (parentId: string) => {
    if (!replyInput.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? {
              ...c,
              replies: [
                ...(c.replies || []),
                {
                  id: `r${(c.replies?.length || 0) + 1}`,
                  user: currentUser,
                  content: replyInput.trim(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
    setReplyInput('');
    setReplyingTo(null);
  };

  return (
    <main className="flex-1 bg-neutral-50">
      {/* Header theo brand */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Chi tiết bài viết</h1>
          <p className="mt-1 text-white/90">Thảo luận & kết nối cộng đồng Freeday</p>
        </div>
      </section>

      {/* 2 cột sáng – chuyên nghiệp */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 pb-10 grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        {/* LEFT: Nội dung */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4 mt-10">
            <img
              src={post.author.avatar || `https://i.pravatar.cc/160?u=${post.author.name}`}
              alt={post.author.name}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <div className="text-lg md:text-xl font-bold text-neutral-900">
                {post.author?.name || 'Demo User'}
              </div>
              <div className="text-xs md:text-sm text-neutral-500">
                Đăng lúc {formatDateTime(post.createdAt)} • Công khai
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">{post.title}</h2>

          {post.tags?.length ? (
            <div className="mb-4 flex gap-2 flex-wrap">
              {post.tags.map((t) => (
                <span
                  key={t.tag.id}
                  className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100"
                >
                  #{t.tag.name}
                </span>
              ))}
            </div>
          ) : null}

          <div className="prose max-w-none text-neutral-800 leading-7 whitespace-pre-line">
            {post.content}
          </div>
        </section>

        {/* RIGHT: Tương tác + bình luận */}
        <aside className="space-y-6">
          {/* Tương tác tổng quan */}
          <article className="rounded-2xl border border-neutral-200 bg-white shadow-sm pt-5">
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex -space-x-1">
                    <span className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[11px]">❤️</span>
                  </span>
                  <span>{likeCount} lượt tương tác</span>
                </div>
                <div>{totalCommentCount} bình luận</div>
              </div>
            </div>

            <nav className="mt-3">
              <div className="border-t border-neutral-200" />
              <div className="grid grid-cols-2">
                <button
                  className={`flex items-center justify-center gap-2 py-3 font-semibold text-sm hover:bg-neutral-50 ${
                    loved ? 'text-rose-500' : 'text-neutral-700'
                  }`}
                  onClick={() => setLoved((v) => !v)}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={loved ? 'currentColor' : 'none'} stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.81 3.85 2.08C11.16 4.81 12.66 4 14.2 4 16.7 4 18.7 6 18.7 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
                  </svg>
                  Yêu thích
                </button>
              </div>
              <div className="border-t border-neutral-200" />
            </nav>

            {/* Form bình luận */}
            <div className="px-5 pb-5 pt-4">
              <div className="flex items-start gap-3">
                <img
                  src={currentUser.avatar || `https://i.pravatar.cc/120?u=${currentUser.id}`}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#08BAA1]"
                      placeholder="Viết bình luận công khai..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                      aria-label="Ô nhập bình luận"
                    />
                    <Button onClick={handleAddComment} className="rounded-full !px-4 !py-3">
                      Gửi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Danh sách bình luận */}
          <article className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
            <h3 className="text-base font-semibold text-neutral-900 mb-3">
              Bình luận ({totalCommentCount})
            </h3>

            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.user.avatar || `https://i.pravatar.cc/150?u=${c.user.id}`}
                    alt={c.user.name}
                    className="w-9 h-9 rounded-full border border-neutral-200 object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-neutral-900">{c.user.name}</span>
                        <span className="text-xs text-neutral-500">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <div className="text-neutral-700">{c.content}</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1 pl-2">
                      <button className="hover:text-neutral-700">Thích</button>
                      <button
                        className="hover:text-neutral-700"
                        onClick={() => setReplyingTo((cur) => (cur === c.id ? null : c.id))}
                      >
                        Trả lời
                      </button>
                    </div>

                    {/* Replies */}
                    {c.replies?.length ? (
                      <div className="mt-4 space-y-3 pl-8">
                        {c.replies.map((r) => (
                          <div key={r.id} className="flex items-start gap-2">
                            <img
                              src={r.user.avatar || `https://i.pravatar.cc/150?u=${r.user.id}`}
                              alt={r.user.name}
                              className="w-7 h-7 rounded-full border border-neutral-200 object-cover"
                            />
                            <div className="bg-white rounded-xl px-3 py-2 flex-1 border border-neutral-200">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-neutral-900">{r.user.name}</span>
                                <span className="text-xs text-neutral-500">{formatDateTime(r.createdAt)}</span>
                              </div>
                              <div className="text-neutral-700">{r.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Reply input */}
                    {replyingTo === c.id && (
                      <div className="mt-3 flex gap-2 items-center pl-8">
                        <img
                          src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`}
                          alt={currentUser.name}
                          className="w-7 h-7 rounded-full border border-neutral-200"
                        />
                        <input
                          type="text"
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleReply(c.id); }}
                          className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#08BAA1]"
                          placeholder="Nhập trả lời..."
                          aria-label="Ô nhập trả lời"
                        />
                        <Button onClick={() => handleReply(c.id)} className="rounded-full !px-4 !py-2">
                          Gửi
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!comments.length && (
                <div className="text-neutral-500 text-sm">Hãy là người đầu tiên bình luận.</div>
              )}
            </div>
          </article>
        </aside>
      </div>
    </main>
  );
};

export default ForumPostDetail;
