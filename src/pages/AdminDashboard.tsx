import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import Button from '@/components/common/Button';
import { adminStats } from '@/data/adminStats';

const AdminDashboard: React.FC = () => {
  // Demo data
  const pendingEventPosts = [
    { id: 1, title: 'Sự kiện Yoga ngoài trời', author: 'Trần Hoàng Dung', date: '2025-09-15', type: 'outdoor' },
    { id: 2, title: 'Workshop Nghệ thuật', author: 'VFCoffeHouse', date: '2025-09-16', type: 'art' },
    { id: 3, title: 'Hội thảo Công nghệ', author: 'Yamaha Mobike', date: '2025-09-17', type: 'social' },
    { id: 4, title: 'Chạy bộ vì sức khỏe', author: 'Cộng Đồng Du lịch Thể Thao C89', date: '2025-09-18', type: 'sports' },
    { id: 5, title: 'Giao lưu Âm nhạc', author: 'Ngô Hùng Vân', date: '2025-09-19', type: 'music' },
    { id: 6, title: 'Triển lãm Mỹ thuật', author: 'Trung Tâm Triễn Lãm Quy Nhơn', date: '2025-09-20', type: 'art' },
    { id: 7, title: 'Sự kiện Khởi nghiệp', author: 'Make You Better', date: '2025-09-21', type: 'social' },
    { id: 8, title: 'Hội chợ Ẩm thực', author: 'Hội Chợ Tỉnh Bình Định', date: '2025-09-22', type: 'food' },
  ];
  const pendingForumPosts = [
    { id: 1, title: 'Tìm bạn tham gia giải chạy', author: 'mazuong2k', date: '2025-09-17' },
    { id: 2, title: 'Chia sẻ kinh nghiệm du lịch', author: 'babilove2k4', date: '2025-09-18' },
    { id: 3, title: 'Hỏi đáp về sự kiện', author: 'Cuong7nui', date: '2025-09-19' },
    { id: 4, title: 'Tìm nhóm học tiếng Anh', author: 'CypherNguyen', date: '2025-09-20' },
    { id: 5, title: 'Review địa điểm tổ chức', author: 'Phạm Hoàng Long', date: '2025-09-21' },
    { id: 6, title: 'Giao lưu bóng đá', author: 'BooBooNicky', date: '2025-09-22' },
    { id: 7, title: 'Tìm bạn cùng sở thích', author: 'Văn Hoàng', date: '2025-09-23' },
    { id: 8, title: 'Chia sẻ ảnh sự kiện', author: 'Layla', date: '2025-09-24' },
  ];
  const ITEMS_PER_PAGE = 5;
  const [eventPage, setEventPage] = React.useState(1);
  const [forumPage, setForumPage] = React.useState(1);
  const [showDetail, setShowDetail] = React.useState<string | null>(null);
  const [selectedPost, setSelectedPost] = React.useState<any | null>(null);
  const [showToast, setShowToast] = React.useState(false);

  // Toast auto-hide effect
  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  // Demo age group data
  const ageStats = {
    under18: 320,
    from18to35: 780,
    above35: 180,
  };
  const eventTypeStats = {
    music: pendingEventPosts.filter(e => e.type === 'music').length,
    sports: pendingEventPosts.filter(e => e.type === 'sports').length,
    food: pendingEventPosts.filter(e => e.type === 'food').length,
    art: pendingEventPosts.filter(e => e.type === 'art').length,
    outdoor: pendingEventPosts.filter(e => e.type === 'outdoor').length,
    social: pendingEventPosts.filter(e => e.type === 'social').length,
  };
  const eventTypePieData = {
    labels: ['Music', 'Sports', 'Food', 'Art', 'Outdoor', 'Social'],
    datasets: [
      {
        data: [eventTypeStats.music, eventTypeStats.sports, eventTypeStats.food, eventTypeStats.art, eventTypeStats.outdoor, eventTypeStats.social],
        backgroundColor: [
          '#22c55e', // Music - xanh
          '#ef4444', // Sports - đỏ
          '#facc15', // Food - vàng
          '#000000', // Art - đen
          '#ffffff', // Outdoor - trắng
          '#ec4899', // Social - hồng
        ],
        borderColor: [
          '#22c55e',
          '#ef4444',
          '#facc15',
          '#000000',
          '#d1d5db',
          '#ec4899',
        ],
        borderWidth: 2,
      },
    ],
  };
  const eventTotalPages = Math.ceil(pendingEventPosts.length / ITEMS_PER_PAGE);
  const forumTotalPages = Math.ceil(pendingForumPosts.length / ITEMS_PER_PAGE);
  const eventPostsToShow = pendingEventPosts.slice((eventPage - 1) * ITEMS_PER_PAGE, eventPage * ITEMS_PER_PAGE);
  const forumPostsToShow = pendingForumPosts.slice((forumPage - 1) * ITEMS_PER_PAGE, forumPage * ITEMS_PER_PAGE);
  const pieData = {
    labels: ['Dưới 18', '18-35', 'Trên 35'],
    datasets: [
      {
        data: [ageStats.under18, ageStats.from18to35, ageStats.above35],
        backgroundColor: ['#22c55e', '#ef4444', '#facc15'],
        borderColor: ['#22c55e', '#ef4444', '#facc15'],
        borderWidth: 2,
      },
    ],
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-[#023334]">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Người tham gia */}
        <div className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center cursor-pointer hover:bg-[#08BAA1]/5 transition" onClick={() => setShowDetail('users')}>
          <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-full bg-[#08BAA1]/10">
            {/* User icon */}
            <svg className="w-8 h-8 text-[#08BAA1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-[#08BAA1]">{adminStats.users}</div>
          <div className="mt-2 text-neutral-700">Người tham gia</div>
        </div>
        {/* Bài đăng sự kiện */}
        <div className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center cursor-pointer hover:bg-[#08BAA1]/5 transition" onClick={() => setShowDetail('eventPosts')}>
          <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-full bg-[#08BAA1]/10">
            {/* Event icon (calendar) */}
            <svg className="w-8 h-8 text-[#08BAA1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-[#08BAA1]">{adminStats.eventPosts}</div>
          <div className="mt-2 text-neutral-700">Bài đăng sự kiện</div>
        </div>
        {/* Bài đăng diễn đàn */}
        <div className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center cursor-pointer hover:bg-[#08BAA1]/5 transition" onClick={() => setShowDetail('forumPosts')}>
          <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-full bg-[#08BAA1]/10">
            {/* Forum icon */}
            <svg className="w-8 h-8 text-[#08BAA1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-[#08BAA1]">{adminStats.forumPosts}</div>
          <div className="mt-2 text-neutral-700">Bài đăng diễn đàn</div>
        </div>
        {/* Tổng tiền đã thanh toán */}
        <div className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center cursor-pointer hover:bg-[#08BAA1]/5 transition" onClick={() => setShowDetail('totalPaid')}>
          <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-full bg-[#08BAA1]/10">
            {/* Money icon (cash) */}
            <svg className="w-8 h-8 text-[#08BAA1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="10" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h.01M22 10h-.01M2 14h.01M22 14h-.01" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-[#08BAA1]">{adminStats.totalPaid.toLocaleString()}đ</div>
          <div className="mt-2 text-neutral-700">Tổng tiền đã thanh toán</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#023334]">Bài đăng sự kiện chờ duyệt</h2>
          <div className="bg-white rounded-xl shadow p-4">
            {pendingEventPosts.length === 0 ? (
              <div className="text-neutral-500">Không có bài đăng nào chờ duyệt.</div>
            ) : (
              <>
                <ul>
                  {eventPostsToShow.map(post => (
                    <li key={post.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div className="flex-1 cursor-pointer" onClick={() => { setSelectedPost(post); setShowDetail('eventPostDetail'); }}>
                        <div className="font-medium text-neutral-900">{post.title}</div>
                        <div className="text-sm text-neutral-500">Tác giả: {post.author} | Ngày: {post.date}</div>
                      </div>
                      <Button size="sm" className="bg-[#08BAA1] text-white">Duyệt</Button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center mt-4 gap-2">
                  <Button size="sm" disabled={eventPage === 1} onClick={() => setEventPage(eventPage - 1)}>Trước</Button>
                  <span className="px-2 text-neutral-700">Trang {eventPage}/{eventTotalPages}</span>
                  <Button size="sm" disabled={eventPage === eventTotalPages} onClick={() => setEventPage(eventPage + 1)}>Sau</Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#023334]">Bài đăng diễn đàn chờ duyệt</h2>
          <div className="bg-white rounded-xl shadow p-4">
            {pendingForumPosts.length === 0 ? (
              <div className="text-neutral-500">Không có bài đăng nào chờ duyệt.</div>
            ) : (
              <>
                <ul>
                  {forumPostsToShow.map(post => (
                    <li key={post.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div className="flex-1 cursor-pointer" onClick={() => { setSelectedPost(post); setShowDetail('forumPostDetail'); }}>
                        <div className="font-medium text-neutral-900">{post.title}</div>
                        <div className="text-sm text-neutral-500">Tác giả: {post.author} | Ngày: {post.date}</div>
                      </div>
                      <Button size="sm" className="bg-[#08BAA1] text-white">Duyệt</Button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center mt-4 gap-2">
                  <Button size="sm" disabled={forumPage === 1} onClick={() => setForumPage(forumPage - 1)}>Trước</Button>
                  <span className="px-2 text-neutral-700">Trang {forumPage}/{forumTotalPages}</span>
                  <Button size="sm" disabled={forumPage === forumTotalPages} onClick={() => setForumPage(forumPage + 1)}>Sau</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Example modal (replace with your actual modal logic) */}
      {showDetail === 'users' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 text-xl" onClick={() => setShowDetail(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-[#08BAA1]">Thống kê người tham gia</h3>
            <Pie data={pieData} />
            <div className="mt-4 text-sm text-neutral-700">
              <div><span className="inline-block w-3 h-3 rounded-full bg-[#22c55e] mr-2"></span>Dưới 18 tuổi: {ageStats.under18} người</div>
              <div><span className="inline-block w-3 h-3 rounded-full bg-[#ef4444] mr-2"></span>18-35 tuổi: {ageStats.from18to35} người</div>
              <div><span className="inline-block w-3 h-3 rounded-full bg-[#facc15] mr-2"></span>Trên 35 tuổi: {ageStats.above35} người</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for event post detail */}
      {showDetail === 'eventPostDetail' && selectedPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 text-xl" onClick={() => { setShowDetail(null); setSelectedPost(null); }}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-[#08BAA1]">Chi tiết bài đăng sự kiện</h3>
            <div className="mb-2 font-semibold text-neutral-900">{selectedPost.title}</div>
            <div className="mb-2 text-sm text-neutral-500">Tác giả: {selectedPost.author} | Ngày: {selectedPost.date}</div>
            <div className="mb-2 text-sm text-neutral-700">Loại sự kiện: {selectedPost.type}</div>
            <div className="mt-4 text-neutral-700">Nội dung sự kiện:<br/>Trải nghiệm không gian sự kiện với những trò chơi thú vị</div>
            <div className="mt-6 flex justify-end">
              <Button size="sm" className="bg-[#08BAA1] text-white" onClick={() => { setShowToast(true); setShowDetail(null); setSelectedPost(null); }}>Duyệt</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for forum post detail */}
      {showDetail === 'forumPostDetail' && selectedPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 text-xl" onClick={() => { setShowDetail(null); setSelectedPost(null); }}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-[#08BAA1]">Chi tiết bài đăng diễn đàn</h3>
            <div className="mb-2 font-semibold text-neutral-900">{selectedPost.title}</div>
            <div className="mb-2 text-sm text-neutral-500">Tác giả: {selectedPost.author} | Ngày: {selectedPost.date}</div>
            <div className="mt-4 text-neutral-700">Nội dung bài đăng (demo):<br/>Tìm người đi chơi ạ</div>
            <div className="mt-6 flex justify-end">
              <Button size="sm" className="bg-[#08BAA1] text-white" onClick={() => { setShowToast(true); setShowDetail(null); setSelectedPost(null); }}>Duyệt</Button>
            </div>
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-[#08BAA1] text-white px-6 py-3 rounded shadow-lg z-[100] text-base font-semibold animate-fadein">
          Tạo bài đăng thành công!
        </div>
      )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

