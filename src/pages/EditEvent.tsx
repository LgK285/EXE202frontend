import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { featuredEvents } from '@/data/featuredEvents';
import { useToast } from '@/components/common/useToast';
import Button from '@/components/common/Button';

const EventStatus = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED']);

const editEventSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty('Tiêu đề không được để trống'),
  description: z.string().nonempty('Mô tả không được để trống'),
  locationText: z.string().nonempty('Địa điểm không được để trống'),
  startAt: z.string().nonempty('Thời gian bắt đầu là bắt buộc'),
  endAt: z.string().nonempty('Thời gian kết thúc là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá vé không hợp lệ').optional(),
  capacity: z.coerce.number().positive('Sức chứa phải là số dương').optional(),
  status: EventStatus.optional(),
  image: z.string().url('Link ảnh không hợp lệ').optional(),
  qr: z.string().optional(),
}).refine(d => new Date(d.startAt) < new Date(d.endAt), {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['endAt'],
});

type EditEventFormValues = z.infer<typeof editEventSchema>;

const EditEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [currentStatus, setCurrentStatus] = useState<z.infer<typeof EventStatus> | undefined>();

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');

  // QR
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [qrError, setQrError] = useState<string>('');
  const [qrLink, setQrLink] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventSchema),
  });

  // ✅ Chỉ khởi tạo 1 lần (hoặc khi id đổi), tránh loop khi gõ
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (!id) return;

    const eventData = featuredEvents.find(e => e.id === id);
    if (!eventData) {
      toast.showToast('Không tìm thấy sự kiện.', 'error');
      navigate('/events/manage');
      return;
    }

    setCurrentStatus('DRAFT');
    reset({
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      locationText: eventData.location || '',
      startAt: eventData.date || '',
      endAt: eventData.date || '',
      price: typeof eventData.price === 'number' ? eventData.price : undefined,
      capacity: eventData.maxParticipants,
      status: 'DRAFT',
      image: eventData.image || '',
      qr: '',
    });

    setImagePreview(eventData.image || '');
    setQrPreview('');
    setQrLink('');
  }, [id, reset]); // ⬅ chỉ phụ thuộc id & reset

  // Image upload/preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setImagePreview(url);
      setValue('image', url, { shouldValidate: true, shouldDirty: true });
    };
    reader.onerror = () => {
      setImageError('Không thể đọc file ảnh. Vui lòng thử lại hoặc nhập link ảnh.');
      setImagePreview('');
    };
    reader.readAsDataURL(file);
  };
  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setValue('image', link, { shouldValidate: false, shouldDirty: true });
    setImageFile(null);
    setImagePreview(link);
    setImageError('');
  };

  // QR upload/preview
  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setQrPreview(url);
      setValue('qr', url, { shouldDirty: true });
      setQrLink('');
    };
    reader.onerror = () => {
      setQrError('Không thể đọc file mã QR. Vui lòng thử lại hoặc nhập link ảnh QR.');
      setQrPreview('');
    };
    reader.readAsDataURL(file);
  };
  const handleQrLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setQrLink(link);
    setQrFile(null);
    setQrPreview(link);
    setValue('qr', link, { shouldDirty: true });
    setQrError('');
  };

  const onFormSubmit = async (data: EditEventFormValues) => {
    // Demo: cập nhật localStorage và cập nhật featuredEvents nếu có
    const updatedEvent = { ...data };
    let events = JSON.parse(localStorage.getItem('demoEvents') || '[]');
    let found = false;
    events = events.map((e: any) => {
      if (e.id === updatedEvent.id) {
        found = true;
        return { ...e, ...updatedEvent };
      }
      return e;
    });
    if (!found) {
      events.push(updatedEvent);
    }
    localStorage.setItem('demoEvents', JSON.stringify(events));
    toast.showToast('Cập nhật thông tin sự kiện thành công! (demo)', 'success');
    navigate(`/events/manage`);
  };

  const handleStatusChange = async (newStatus: z.infer<typeof EventStatus>) => {
    toast.showToast(
      `Sự kiện đã được ${newStatus === 'PUBLISHED' ? 'công khai' : newStatus === 'DRAFT' ? 'chuyển về bản nháp' : 'cập nhật trạng thái'} (demo).`,
      'success'
    );
    setCurrentStatus(newStatus);
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'PUBLISHED': return <span className="badge badge-success">Đã công khai</span>;
      case 'DRAFT': return <span className="badge badge-warning">Bản nháp</span>;
      case 'CLOSED': return <span className="badge badge-error">Đã đóng</span>;
      case 'CANCELLED': return <span className="badge badge-error">Đã hủy</span>;
      default: return <span className="badge">Không rõ</span>;
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023334] to-[#08BAA1] text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Chỉnh sửa sự kiện</h1>
          <p className="mt-1 text-white/90">Cập nhật thông tin chi tiết cho sự kiện của bạn.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="text-neutral-700">
              {/* <div className="text-sm">Trạng thái hiện tại</div> */}
              <div className="mt-1">{getStatusBadge(currentStatus)}</div>
            </div>
            <div className="flex gap-2">
              {currentStatus === 'DRAFT' && (
                <Button type="button" onClick={() => handleStatusChange('PUBLISHED')} className="rounded-xl">
                  Công khai sự kiện
                </Button>
              )}
              {currentStatus === 'PUBLISHED' && (
                <Button type="button" variant="outline" onClick={() => handleStatusChange('DRAFT')} className="rounded-xl">
                  Chuyển về bản nháp
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title">Tiêu đề sự kiện</label>
              <input id="title" {...register('title')} className={`input ${errors.title ? 'input-error' : ''}`} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description">Mô tả chi tiết</label>
              <textarea id="description" rows={5} {...register('description')} className={`input ${errors.description ? 'input-error' : ''}`} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="locationText">Địa điểm</label>
              <input id="locationText" {...register('locationText')} className={`input ${errors.locationText ? 'input-error' : ''}`} />
              {errors.locationText && <p className="text-red-500 text-sm mt-1">{errors.locationText.message}</p>}
            </div>

            {/* Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <label className="block mb-2">Ảnh sự kiện</label>
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="input" />
                {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}

                <label htmlFor="image" className="mt-3 block">Hoặc nhập link ảnh sự kiện</label>
                <input
                  id="image"
                  {...register('image')}
                  onChange={handleImageLinkChange}
                  className={`input ${errors.image ? 'input-error' : ''}`}
                  // không ép value ở đây để RHF quản, chỉ clear khi có file
                  value={imageFile ? '' : undefined}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image?.message}</p>}

                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Preview" className="max-h-40 rounded shadow border border-neutral-200" />
                  </div>
                )}
              </div>

              {/* QR */}
              <div>
                <label className="block mb-2">Mã QR đặt cọc (tuỳ chọn)</label>
                <input id="qrUpload" type="file" accept="image/*" onChange={handleQrChange} className="input" />
                {qrError && <p className="text-red-500 text-sm mt-1">{qrError}</p>}

                <label htmlFor="qrLink" className="mt-3 block">Hoặc nhập link ảnh mã QR</label>
                <input
                  id="qrLink"
                  type="url"
                  value={qrFile ? '' : qrLink}
                  onChange={handleQrLinkChange}
                  className="input"
                />
                {qrPreview && (
                  <div className="mt-3">
                    <img src={qrPreview} alt="QR Preview" className="max-h-40 rounded shadow border border-neutral-200" />
                  </div>
                )}
              </div>
            </div>

            {/* Time & capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startAt">Thời gian bắt đầu</label>
                <input id="startAt" type="datetime-local" {...register('startAt')} className={`input ${errors.startAt ? 'input-error' : ''}`} />
                {errors.startAt && <p className="text-red-500 text-sm mt-1">{errors.startAt.message}</p>}
              </div>
              <div>
                <label htmlFor="endAt">Thời gian kết thúc</label>
                <input id="endAt" type="datetime-local" {...register('endAt')} className={`input ${errors.endAt ? 'input-error' : ''}`} />
                {errors.endAt && <p className="text-red-500 text-sm mt-1">{errors.endAt.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price">Giá vé (để trống nếu miễn phí)</label>
                <input id="price" type="number" {...register('price')} className={`input ${errors.price ? 'input-error' : ''}`} />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label htmlFor="capacity">Sức chứa (để trống nếu không giới hạn)</label>
                <input id="capacity" type="number" {...register('capacity')} className={`input ${errors.capacity ? 'input-error' : ''}`} />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Hủy
              </Button>
              <div className="flex gap-3">
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="rounded-xl">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditEvent;
