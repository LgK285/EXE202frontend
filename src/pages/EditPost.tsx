import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/common/Button';
import { useToast } from '@/components/common/useToast';
import { forumPosts } from '@/data/forumPosts';

const editPostSchema = z.object({
  title: z.string().nonempty('Tiêu đề không được để trống'),
  content: z.string().nonempty('Nội dung không được để trống'),
  tags: z.string().optional(),
});
type EditPostFormValues = z.infer<typeof editPostSchema>;

// Giúp tương thích cả 2 kiểu route: /forum/edit/:id hoặc /forum/:id/edit
type Params = { id?: string; postId?: string };

const EditPost: React.FC = () => {
  const { id, postId } = useParams<Params>();
  const theId = id ?? postId; // id dùng để tìm bài
  const navigate = useNavigate();
  const toast = useToast();

  // Ưu tiên dữ liệu demo trong localStorage nếu có
  const getPosts = React.useCallback(() => {
    try {
      const posts = JSON.parse(localStorage.getItem('demoForumPosts') || '[]');
      if (Array.isArray(posts) && posts.length > 0) return posts;
    } catch {}
    return forumPosts;
  }, []);

  const [post, setPost] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  const form = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: { title: '', content: '', tags: '' }, // set mặc định rỗng, sẽ reset khi có post
  });
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form;

  // Load bài viết theo id và reset form khi có dữ liệu
  React.useEffect(() => {
    if (!theId) {
      setLoading(false);
      return;
    }
    const posts = getPosts();
    const found = posts.find((p: any) => p.id === theId) || null;
    setPost(found);
    if (found) {
      reset({
        title: found.title || '',
        content: found.content || '',
        tags: (found.tags?.map((t: any) => t.tag?.name).filter(Boolean) ?? []).join(', '),
      });
    }
    setLoading(false);
  }, [theId, getPosts, reset]);

  const onSubmit = async (data: EditPostFormValues) => {
    if (!post) return;
    const updatedPost = {
      ...post,
      title: data.title,
      content: data.content,
      tags: (data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
      ).map((name) => ({ tag: { id: name, name } })),
    };

    const allPosts = getPosts();
    const updated = allPosts.map((p: any) => (p.id === post.id ? updatedPost : p));
    localStorage.setItem('demoForumPosts', JSON.stringify(updated));

    toast.showToast('Cập nhật bài viết thành công!', 'success');
    navigate('/forum');
  };

  const handleDelete = () => {
    if (!post) return;
    const allPosts = getPosts();
    const updated = allPosts.filter((p: any) => p.id !== post.id);
    localStorage.setItem('demoForumPosts', JSON.stringify(updated));
    toast.showToast('Đã xóa bài viết!', 'success');
    navigate('/forum');
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải…</div>;
  }
  if (!post) {
    // Trả về rõ ràng thay vì văng Not Found của Router
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">Không tìm thấy bài viết.</p>
        <Button onClick={() => navigate('/forum')}>Về diễn đàn</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Chỉnh sửa bài viết
        </h1>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Tiêu đề bài viết
            </label>
            <input
              id="title"
              {...register('title')}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="Nhập tiêu đề bài viết"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
              Nội dung chi tiết
            </label>
            <textarea
              id="content"
              rows={8}
              {...register('content')}
              className={`input ${errors.content ? 'input-error' : ''}`}
              placeholder="Nhập nội dung chi tiết"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              id="tags"
              {...register('tags')}
              className="input"
              placeholder="Ví dụ: hiking, boardgame"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/forum')} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              Xóa bài đăng
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
