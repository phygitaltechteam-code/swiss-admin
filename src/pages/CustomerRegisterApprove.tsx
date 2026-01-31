import React, {useState} from 'react';

import {UserRequest} from '@/types/approval';
import {MdMenu, MdSecurity} from 'react-icons/md';
import RequestList from '@/components/approval/RequestList';
import DetailPanel from '@/components/approval/DetailPanel';
import {MOCK_REQUESTS} from '@/components/approval/constants';

const CustomerRegisterApprove: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<UserRequest>(
    MOCK_REQUESTS[0],
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white/50 md:flex-row">
      {/* Mobile Header */}
      <header className="border-gray-200 z-20 flex items-center justify-between border-b bg-white p-4 md:hidden">
        <div className="flex items-center gap-2">
          <MdSecurity className="text-2xl text-primary" />
          <span className="text-sidebar-text text-lg font-bold">
            BankSecure
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-900"
        >
          <MdMenu size={28} />
        </button>
      </header>

      {/* Main Layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar (Responsive) */}
        <div
          className={`absolute inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} `}
        ></div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Center Content (Request List) */}
        <main className="flex flex-1 overflow-hidden">
          <RequestList
            requests={MOCK_REQUESTS}
            onSelect={(req) => {
              setSelectedRequest(req);
              // On mobile, we might want to navigate or open a modal,
              // but for this dashboard layout, we'll keep the 3-pane structure logic.
            }}
            selectedId={selectedRequest.id}
          />
        </main>

        {/* Right Panel (Details) - Hidden on smaller than xl screens usually, but we'll adapt */}
        <div className="hidden xl:block">
          <DetailPanel request={selectedRequest} />
        </div>
      </div>
    </div>
  );
};

export default CustomerRegisterApprove;
