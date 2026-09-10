import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Programs from './pages/Programs';
import EducationSupport from './pages/EducationSupport';
import EmpowermentPrograms from './pages/EmpowermentPrograms';
import Impact from './pages/Impact';
import Gallery from './pages/Gallery';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import GetInvolved from './pages/GetInvolved';
import ContactUs from './pages/ContactUs';
import Donate from './pages/Donate';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import DashboardOverview from './pages/admin/DashboardOverview';
import ProgramManager from './pages/admin/ProgramManager';
import ImpactManager from './pages/admin/ImpactManager';
import GalleryManager from './pages/admin/GalleryManager';
import NewsManager from './pages/admin/NewsManager';
import TestimonialManager from './pages/admin/TestimonialManager';
import MessageManager from './pages/admin/MessageManager';
import VolunteerManager from './pages/admin/VolunteerManager';
import ApplicationManager from './pages/admin/ApplicationManager';
import DonationManager from './pages/admin/DonationManager';
import SettingsManager from './pages/admin/SettingsManager';

// Scroll to top helper on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout Wrapper with Navbar & Footer
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/education" element={<EducationSupport />} />
          <Route path="/empowerment" element={<EmpowermentPrograms />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/donate" element={<Donate />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="programs" element={<ProgramManager />} />
          <Route path="impact" element={<ImpactManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="testimonials" element={<TestimonialManager />} />
          <Route path="messages" element={<MessageManager />} />
          <Route path="volunteers" element={<VolunteerManager />} />
          <Route path="applications" element={<ApplicationManager />} />
          <Route path="donations" element={<DonationManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 font-display">404 - Page Not Found</h1>
              <p className="text-sm text-slate-600">The requested page does not exist.</p>
              <a href="/" className="px-6 py-2.5 bg-brand-900 text-white font-semibold rounded-xl text-xs">
                Return Home
              </a>
            </div>
          } />
        </Route>

      </Routes>
    </>
  );
}
