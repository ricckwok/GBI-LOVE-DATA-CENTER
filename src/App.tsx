/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChurchProvider, useChurch } from './context/ChurchContext';
import { TabType } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/ui/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { BirthdayNotificationModal } from './components/notifications/BirthdayNotificationModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { KKJListView } from './components/kkj/KKJListView';
import { MemberListView } from './components/members/MemberListView';
import { COOLListView } from './components/cool/COOLListView';
import { SacramentsView } from './components/sacraments/SacramentsView';
import { WorkersView } from './components/workers/WorkersView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { BirthdayView } from './components/birthday/BirthdayView';
import { WhatsAppView } from './components/whatsapp/WhatsAppView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useChurch();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBirthdayNotificationOpen, setIsBirthdayNotificationOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Global Keyboard Shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // If not logged in, render the multi-role Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
        onLogout={logout}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <Topbar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onOpenGlobalSearch={() => setIsSearchOpen(true)}
          onOpenBirthdayNotification={() => setIsBirthdayNotificationOpen(true)}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={handleNavigate}
              onOpenBirthdayModal={() => setIsBirthdayNotificationOpen(true)}
            />
          )}
          {activeTab === 'kkj' && <KKJListView />}
          {activeTab === 'members' && <MemberListView />}
          {activeTab === 'cool' && <COOLListView />}
          {activeTab === 'sacraments' && <SacramentsView />}
          {activeTab === 'workers' && <WorkersView />}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'birthday' && <BirthdayView />}
          {activeTab === 'whatsapp' && <WhatsAppView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Search Spotlight */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Birthday Pastoral Notification Center Modal */}
      <BirthdayNotificationModal
        isOpen={isBirthdayNotificationOpen}
        onClose={() => setIsBirthdayNotificationOpen(false)}
        onNavigateToBirthdayView={() => handleNavigate('birthday')}
      />

      {/* Quick Account Profile Edit Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ChurchProvider>
      <AppContent />
    </ChurchProvider>
  );
}

