import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Reveal from '@/components/motion/Reveal';
import { forumPosts } from '@/data/forumPosts';

type Post = typeof forumPosts[number];

const Forum: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'most_comments' | 'most_likes'>('newest');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set(forumPosts.flatMap(p => p.tags?.map(t => t.tag.name) || []))),
    []
  );

  // Lấy danh sách bài viết từ localStorage nếu có
  const getPosts = () => {
    try {
      const posts = JSON.parse(localStorage.getItem('demoForumPosts') || '[]');
      if (posts.length > 0) return posts;
    } catch {}
    return forumPosts;
  };

  const [posts, setPosts] = useState(getPosts());

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let rows = posts.filter(p => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.tags || []).some((t: any) => t.tag.name.toLowerCase().includes(q));
      const matchTag =
        selectedTag === 'all' || (p.tags && p.tags.some((t: any) => t.tag.name === selectedTag));
      return matchSearch && matchTag;
    });

    rows = rows.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'most_comments') {
        return (b._count?.comments || 0) - (a._count?.comments || 0);
      }
      return (b._count?.likes || 0) - (a._count?.likes || 0);
    });

    return rows;
  }, [searchTerm, selectedTag, sortBy, posts]);

  const [_, forceUpdate] = useState(0);
  const handleDelete = (id: string) => {
    // Xóa trong localStorage nếu có
    let posts = [];
    try {
      posts = JSON.parse(localStorage.getItem('demoForumPosts') || '[]');
    } catch {
      posts = [];
    }
    // Xóa trong localStorage nếu có
    let demoPosts = [];
    try {
      demoPosts = JSON.parse(localStorage.getItem('demoForumPosts') || '[]');
    } catch {
      demoPosts = [];
    }
    if (demoPosts.length > 0) {
      const newPosts = demoPosts.filter((p: any) => p.id !== id);
      localStorage.setItem('demoForumPosts', JSON.stringify(newPosts));
      setPosts(newPosts);
      return;
    }
    // Nếu không có demoForumPosts thì xóa trong forumPosts (chỉ demo, không lưu được)
    const idx = forumPosts.findIndex(p => p.id === id);
    if (idx !== -1) {
      forumPosts.splice(idx, 1);
      setPosts([...forumPosts]);
    }
  };

  const StatChip: React.FC<{ icon: React.ReactNode; value: number; title: string }> = ({ icon, value, title }) => (
    <span title={title} className="inline-flex items-center gap-1 text-sm text-neutral-600">
      {icon}
      <span>{value}</span>
    </span>
  );

  const TagChip: React.FC<{ label: string }> = ({ label }) => (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 h-7 text-xs text-neutral-700">
      #{label}
    </span>
  );

  const PostCard: React.FC<{ post: Post; index: number }> = ({ post, index }) => (
    <Reveal delay={70 * index}>
      <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start gap-4">
          <img
            src={post.author.avatar || `https://i.pravatar.cc/150?u=${post.author.name}`}
            alt={post.author.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/forum/${post.id}`}
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                    className="block truncate text-lg font-semibold text-neutral-900 hover:text-[#08BAA1] max-w-[48vw]"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                  <div className="hidden md:flex items-center gap-3 text-sm text-neutral-600">
                    <span className="truncate max-w-[16vw]">{post.author.name}</span>
                    <span className="text-neutral-300">•</span>
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </time>
                  </div>
                </div>
                <div className="md:hidden mt-1 flex flex-wrap items-center gap-x-3 text-sm text-neutral-600">
                  <span className="truncate">{post.author.name}</span>
                  <span className="text-neutral-300">•</span>
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </time>
                </div>
              </div>

              {(post.author.name === 'Khánh Gia') && (
                <div className="shrink-0 flex gap-2">
                  <Link to={`/forum/edit/${post.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Button size="sm" variant="outline" className="rounded-lg h-9">Sửa</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                    className="rounded-lg h-9 !text-red-600 !border-red-300 hover:!bg-red-50"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>

            <p className="mt-3 line-clamp-2 text-neutral-700">{post.content}</p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-5">
                <StatChip
                  title="Lượt thích"
                  value={post._count?.likes ?? 0}
                  icon={
                    <svg className="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                />
                <Link
                  to={`/forum/${post.id}`}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-[#08BAA1]"
                  title="Bình luận"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post._count?.comments ?? 0}</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                {post.tags?.map(t => <TagChip key={t.tag.id} label={t.tag.name} />)}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );

  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Diễn đàn kết nối</h1>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-2 text-white/90">Tìm bạn đồng hành và chia sẻ trải nghiệm</p>
          </Reveal>
        </div>
      </section>

      {/* Controls + List */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <Reveal>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 shadow-sm">
            <div className="mt-7 flex items-center gap-3 flex-wrap md:flex-nowrap">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input h-10 flex-1 min-w-[260px]"
                aria-label="Tìm kiếm bài viết"
              />

              <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                <label htmlFor="sort" className="sr-only">Sắp xếp</label>
                <span className="hidden sm:inline text-sm text-neutral-600">Sắp xếp</span>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="input h-10 w-[180px] p-2"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="most_comments">Nhiều bình luận</option>
                  <option value="most_likes">Nhiều lượt thích</option>
                </select>
              </div>

              <div className="shrink-0 md:ml-auto">
                <Link to="/forum/create" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                  <Button className="rounded-xl h-10 px-4 inline-flex items-center">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Đăng bài mới
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 min-h-[36px]">
              <button
                onClick={() => setSelectedTag('all')}
                className={`h-9 whitespace-nowrap rounded-full px-3 text-sm ${
                  selectedTag === 'all'
                    ? 'bg-[#08BAA1] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Tất cả
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`h-9 whitespace-nowrap rounded-full px-3 text-sm ${
                    selectedTag === tag
                      ? 'bg-[#08BAA1] text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTag !== 'all' && (
                <button
                  onClick={() => setSelectedTag('all')}
                  className="h-9 ml-1 rounded-full px-3 text-sm text-neutral-600 hover:bg-neutral-100"
                  aria-label="Xóa bộ lọc"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-4 text-sm text-neutral-600">
            Tìm thấy <span className="font-medium text-neutral-800">{filteredPosts.length}</span> bài viết
          </div>
        </Reveal>

        {/* List */}
        {filteredPosts.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5">
            {filteredPosts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <svg className="h-6 w-6 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Không tìm thấy bài viết</h3>
              <p className="mt-1 text-neutral-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              <div className="mt-4">
                <Link to="/forum/create" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                  <Button className="rounded-xl h-10 px-4">Đăng bài đầu tiên</Button>
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </div>
  );
};

export default Forum;
