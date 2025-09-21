import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Forum from '@/pages/Forum';
import CreatePost from '@/pages/CreatePost';
import EventManagement from '@/pages/EventManagement';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import PrivateRoute from '@/components/common/PrivateRoute';
import ProfilePage from '@/pages/Profile'; // Correct import
import ForumPostDetail from '@/pages/ForumPostDetail';
import RegisteredEvents from '@/pages/RegisteredEvents';
import CreateEvent from '@/pages/CreateEvent';
import EditEvent from '@/pages/EditEvent';
import AdminDashboard from '@/pages/AdminDashboard';
import PaymentUpgrade from '@/pages/PaymentUpgrade';
import EventPayment from '@/pages/EventPayment';
import RegisteredTicket from '@/pages/RegisteredTicket';

// The MainLayout now acts as a layout route component.
const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Standalone routes (no MainLayout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Parent route for all pages using the MainLayout */}
        <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>

          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="forum" element={<Forum />} />
            <Route path="forum/create" element={<CreatePost />} />
            <Route path="forum/:postId" element={<ForumPostDetail />} />
            <Route path="my-events" element={<RegisteredEvents />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="payment-upgrade" element={<PaymentUpgrade />} />
            <Route path="event-payment" element={<EventPayment />} />
            <Route path="registered-ticket" element={<RegisteredTicket />} />
          </Route>

          {/* Event management routes - demo mode, no protection */}
          <Route path="events/manage" element={<EventManagement />} />
          <Route path="events/new" element={<CreateEvent />} />
          <Route path="events/edit/:id" element={<EditEvent />} />

          {/* Admin dashboard route */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter; 