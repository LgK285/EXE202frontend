import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/common/useToast';
import Button from '@/components/common/Button';

/* ---------- Zod helpers ---------- */
const asString = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
const strReq = (msg: string) => z.preprocess(asString, z.string().min(1, msg));
const emptyToUndefined = (v: unknown) => {
  const s = v == null ? '' : String(v);
  return s.trim() === '' ? undefined : s;
};

/* ---------- Tag constants ---------- */
const TAGS = ['food', 'music', 'art', 'sport', 'outdoor', 'social'] as const;
type TagType = typeof TAGS[number];

const createEventSchema = z
  .object({
    title: strReq('Tiêu đề không được để trống'),
    description: strReq('Mô tả không được để trống'),
    locationText: strReq('Địa điểm không được để trống'),

    image: z.preprocess(emptyToUndefined, z.string().url('Link ảnh không hợp lệ').optional()),

    startAt: strReq('Thời gian bắt đầu là bắt buộc'),
    endAt: strReq('Thời gian kết thúc là bắt buộc'),

    price: z
      .union([z.coerce.number().min(0, 'Giá vé không hợp lệ'), z.literal(NaN)])
      .optional()
      .transform((v) => (Number.isNaN(v) ? undefined : v)),

    capacity: z
      .union([z.coerce.number().positive('Sức chứa phải là số dương'), z.literal(NaN)])
      .optional()
      .transform((v) => (Number.isNaN(v) ? undefined : v)),

    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),

    // ✅ tags: mảng string, chỉ cho phép nằm trong 6 tag cố định
    tags: z.array(z.enum(TAGS)).default([]),
  })
  .refine(
    (data) => {
      if (!data.startAt || !data.endAt) return false;
      return new Date(data.startAt) < new Date(data.endAt);
    },
    {
      message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
      path: ['endAt'],
    }
  );

type CreateEventFormValues = z.infer<typeof createEventSchema>;

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Ảnh bìa
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [imageError, setImageError] = React.useState<string>('');

  // QR (không bắt buộc)
  const [qrFile, setQrFile] = React.useState<File | null>(null);
  const [qrPreview, setQrPreview] = React.useState<string>('');
  const [qrError, setQrError] = React.useState<string>('');
  const [qrLink, setQrLink] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      locationText: '',
      image: '',
      startAt: '',
      endAt: '',
      tags: [], // ✅ mặc định không chọn tag
    },
  });

  const selectedTags = watch('tags') || [];

  /* -------- Image handlers -------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setImageError('Không thể đọc file ảnh. Vui lòng thử lại hoặc nhập link ảnh.');
      setImagePreview('');
    };
    reader.readAsDataURL(file);
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('image', e.target.value, { shouldValidate: false });
    if (e.target.value) {
      setImageFile(null);
      setImagePreview(e.target.value);
      setImageError('');
    }
  };

  /* -------- QR handlers -------- */
  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result as string);
      setQrLink('');
    };
    reader.onerror = () => {
      setQrError('Không thể đọc file mã QR. Vui lòng thử lại hoặc nhập link ảnh QR.');
      setQrPreview('');
    };
    reader.readAsDataURL(file);
  };

  /* -------- Tag toggle -------- */
  const toggleTag = (tag: TagType) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setValue('tags', Array.from(next) as TagType[], { shouldValidate: true, shouldDirty: true });
  };

  /* -------- Submit -------- */
  const doSubmit = async (data: CreateEventFormValues) => {
    const link = (watch('image') || '').trim();
    const hasAnyImage = !!imagePreview || !!link;
    if (!hasAnyImage) {
      toast.showToast('Vui lòng tải ảnh bìa hoặc nhập link ảnh sự kiện.', 'error');
      return;
    }

    const newEvent = {
      id: 'evt-' + Math.random().toString(36).slice(2, 9),
      title: data.title,
      description: data.description,
      locationText: data.locationText,
      status: data.status === 'PUBLISHED' ? 'Published' : 'Draft',
      startAt: data.startAt,
      endAt: data.endAt,
      price: data.price,
      capacity: data.capacity,
      _count: { registrations: 0 },
      image: imagePreview || link,
      qr: qrPreview || qrLink || undefined,
      // ✅ Lưu tags
      tags: data.tags, // ['food','music',...]
    };

    toast.showToast(
      `Sự kiện đã được ${data.status === 'PUBLISHED' ? 'công khai' : 'lưu làm nháp'} thành công!`,
      'success'
    );

    const events = JSON.parse(localStorage.getItem('demoEvents') || '[]');
    events.push(newEvent);
    localStorage.setItem('demoEvents', JSON.stringify(events));
    navigate('/events/manage', { state: { newEvent } });
  };

  const submitWithStatus = (status: 'DRAFT' | 'PUBLISHED') =>
    handleSubmit((form) => doSubmit({ ...form, status }));

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Tạo sự kiện mới</h1>
          <p className="mt-1 text-white/90">Điền thông tin để khởi tạo sự kiện của bạn.</p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 md:p-8 space-y-8"
        >
          {/* Basic */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Thông tin cơ bản</h2>
            <div className="mt-4 grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Tiêu đề sự kiện
                </label>
                <input id="title" {...register('title')} className={`input h-11 ${errors.title ? 'input-error' : ''}`} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea id="description" rows={5} {...register('description')} className={`input ${errors.description ? 'input-error' : ''}`} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <label htmlFor="locationText" className="block text-sm font-medium text-neutral-700 mb-1">
                  Địa điểm
                </label>
                <input id="locationText" {...register('locationText')} className={`input h-11 ${errors.locationText ? 'input-error' : ''}`} />
                {errors.locationText && <p className="text-red-500 text-sm mt-1">{errors.locationText.message}</p>}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Tags sự kiện</h2>
            <p className="mt-1 text-sm text-neutral-600">Chọn một hoặc nhiều tag phù hợp.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`h-9 rounded-full px-3 text-sm transition ${
                      active
                        ? 'bg-[#08BAA1] text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                    aria-pressed={active}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-sm text-neutral-600">
              Đã chọn: <span className="font-medium text-neutral-800">{selectedTags.length}</span> tag
            </div>
            {/* field error nếu có */}
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.tags as any)?.message || 'Tag không hợp lệ'}
              </p>
            )}
          </div>

          {/* Media */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Hình ảnh & Mã QR</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="text-sm font-medium text-neutral-800 mb-2">Ảnh sự kiện</div>
                <div className="flex flex-col gap-3">
                  <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="input h-11 p-1.5" />
                  {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
                  <div>
                    <label htmlFor="image" className="block text-sm text-neutral-600 mb-1">
                      Hoặc nhập link ảnh
                    </label>
                    <input
                      id="image"
                      {...register('image')}
                      onChange={handleImageLinkChange}
                      className={`input h-11 ${errors.image ? 'input-error' : ''}`}
                      placeholder="https://..."
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <div className="relative overflow-hidden rounded-xl border border-neutral-200">
                        <img src={imagePreview} alt="Preview" className="max-h-56 w-full object-cover" />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">Xem trước ảnh bìa</p>
                    </div>
                  )}
                </div>
              </div>

              {/* QR */}
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="text-sm font-medium text-neutral-800 mb-2">Mã QR đặt cọc (tuỳ chọn)</div>
                <div className="flex flex-col gap-3">
                  <input id="qrUpload" type="file" accept="image/*" onChange={handleQrChange} className="input h-11 p-1.5" />
                  {qrError && <p className="text-red-500 text-sm">{qrError}</p>}
                  <div>
                    <label htmlFor="qrLink" className="block text-sm text-neutral-600 mb-1">
                      Hoặc nhập link ảnh mã QR
                    </label>
                    <input
                      id="qrLink"
                      type="url"
                      value={qrFile ? '' : qrLink}
                      onChange={(e) => {
                        setQrLink(e.target.value);
                        setQrFile(null);
                        setQrPreview(e.target.value);
                        setQrError('');
                      }}
                      className="input h-11"
                      placeholder="https://..."
                    />
                  </div>
                  {qrPreview && (
                    <div className="mt-2">
                      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                        <img src={qrPreview} alt="QR Preview" className="max-h-56 mx-auto object-contain p-3" />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">Xem trước mã QR</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time & Capacity */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Thời gian & Sức chứa</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startAt" className="block text-sm font-medium text-neutral-700 mb-1">
                  Thời gian bắt đầu
                </label>
                <input id="startAt" type="datetime-local" {...register('startAt')} className={`input h-11 ${errors.startAt ? 'input-error' : ''}`} />
                {errors.startAt && <p className="text-red-500 text-sm mt-1">{errors.startAt.message}</p>}
              </div>
              <div>
                <label htmlFor="endAt" className="block text-sm font-medium text-neutral-700 mb-1">
                  Thời gian kết thúc
                </label>
                <input id="endAt" type="datetime-local" {...register('endAt')} className={`input h-11 ${errors.endAt ? 'input-error' : ''}`} />
                {errors.endAt && <p className="text-red-500 text-sm mt-1">{errors.endAt.message}</p>}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                  Giá vé <span className="text-neutral-400">(để trống nếu miễn phí)</span>
                </label>
                <input id="price" type="number" {...register('price')} className={`input h-11 ${errors.price ? 'input-error' : ''}`} />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-neutral-700 mb-1">
                  Sức chứa <span className="text-neutral-400">(để trống nếu không giới hạn)</span>
                </label>
                <input id="capacity" type="number" {...register('capacity')} className={`input h-11 ${errors.capacity ? 'input-error' : ''}`} />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-neutral-200 pt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
              Hủy
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={submitWithStatus('DRAFT')}
                className="rounded-xl"
              >
                Lưu làm nháp
              </Button>
              <Button
                type="button"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={submitWithStatus('PUBLISHED')}
                className="rounded-xl"
              >
                Lưu & Công khai
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateEvent;
