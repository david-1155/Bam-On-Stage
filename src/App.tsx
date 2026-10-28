/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import DemoBanner from './components/common/DemoBanner.jsx';
import Navbar from './components/layout/Navbar.jsx';
import SidebarDrawer from './components/layout/SidebarDrawer.jsx';
import SearchModal from './components/common/SearchModal.jsx';
import Footer from './components/layout/Footer.jsx';

import HomePage from './pages/HomePage.jsx';
import TalentsPage from './pages/TalentsPage.jsx';
import InstructorProfilePage from './pages/InstructorProfilePage.jsx';
import AreasPage from './pages/AreasPage.jsx';
import AreaDetailPage from './pages/AreaDetailPage.jsx';
import ScheduleAvailabilityPage from './pages/ScheduleAvailabilityPage.jsx';
import LocationsPage from './pages/LocationsPage.jsx';
import BookingRequestPage from './pages/BookingRequestPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ApplyInstructorPage from './pages/ApplyInstructorPage.jsx';
import InstructorDashboardPage from './pages/InstructorDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Scroll to top automatically when navigating between pages
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A10] text-slate-100 selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <ScrollToTop />
      
      {/* Informative Honest Demo Banner */}
      <DemoBanner />

      {/* Top Navbar */}
      <Navbar
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Mobile & Desktop Drawer Sidebar */}
      <SidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Dynamic Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/talentos" element={<TalentsPage />} />
          <Route path="/talentos/:instructorId" element={<InstructorProfilePage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/areas/:areaSlug" element={<AreaDetailPage />} />
          <Route path="/horarios" element={<ScheduleAvailabilityPage />} />
          <Route path="/lugares" element={<LocationsPage />} />
          <Route path="/reservar/:instructorId" element={<BookingRequestPage />} />
          <Route path="/mis-reservas" element={<MyBookingsPage />} />
          <Route path="/tareas" element={<TasksPage />} />
          <Route path="/dar-refuerzos" element={<ApplyInstructorPage />} />
          <Route path="/postularse" element={<ApplyInstructorPage />} />
          <Route path="/instructor" element={<InstructorDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-clave" element={<ForgotPasswordPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
