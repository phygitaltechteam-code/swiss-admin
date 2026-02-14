import React, {useEffect, useState} from 'react';
import {UserRequest} from '@/types/approval';
import {MdMenu, MdSecurity} from 'react-icons/md';
import RequestList from '@/components/approval/RequestList';
import DetailPanel from '@/components/approval/DetailPanel';
import {useGetCustomer} from '@/lib/react-query/Customer';

const CustomerRegisterApprove: React.FC = () => {
  const {data: AllCustomers} = useGetCustomer();
  console.log('allCustomers', AllCustomers);
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(
    null,
  );

  useEffect(() => {
    if (AllCustomers && AllCustomers.length > 0) {
      setSelectedRequest(AllCustomers[0]);
    }
  }, [AllCustomers]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white/50 md:flex-row">
      {/* Mobile Header */}

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
            requests={AllCustomers || []}
            onSelect={(req) => {
              setSelectedRequest(req);
            }}
            selectedId={selectedRequest?.id}
          />
        </main>

        {/* Right Panel (Details) - Hidden on smaller than xl screens usually, but we'll adapt */}
        <div className="hidden xl:block">
          {/* <DetailPanel request={selectedRequest} /> */}
        </div>
      </div>
    </div>
  );
};

export default CustomerRegisterApprove;
