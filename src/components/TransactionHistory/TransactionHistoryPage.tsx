import React, {useMemo, useState} from 'react';
import {MdArrowBack, MdDownload} from 'react-icons/md';
import {useNavigate} from '@tanstack/react-router';

import Header from './Header';
import TransactionFilters, {TransactionFilterState} from './TransactionFilters';
import TransactionTable from './TransactionTable';

import {useGettransactionCustomerById} from '@/lib/react-query/client';
import {Route} from '@/routes/_app/client/transactionhistory.$id';

const TransactionHistoryPage: React.FC = () => {
  const {id} = Route.useParams(); // client ID from URL param
  const navigate = useNavigate();
  const {data, isLoading} = useGettransactionCustomerById(id);
  const [filters, setFilters] = useState<TransactionFilterState>({
    type: '',
    from: null,
    to: null,
  });

  const wallet = data?.wallets?.[0];

  const transactions = useMemo(() => {
    const raw = wallet?.transactions ?? [];

    return raw
      .filter((trx: any) => {
        if (filters.type && trx.type !== filters.type) return false;
        if (filters.from && new Date(trx.createdAt) < filters.from)
          return false;
        if (filters.to && new Date(trx.createdAt) > filters.to) return false;
        return true;
      })
      .map((trx: any) => ({
        id: trx.id,
        date: new Date(trx.createdAt).toLocaleDateString(),
        time: new Date(trx.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        recipient: trx.beneficiary?.fullName ?? trx.particular ?? '—',
        type: trx.type === 'CREDIT' ? 'Deposit' : 'Transfer',
        amount: trx.type === 'CREDIT' ? trx.amount : -trx.amount,
        status: trx.isPending ? 'Pending' : 'Approved',
      }));
  }, [wallet, filters]);

  const handleBack = () => {
    navigate({to: `/client/profile?id=${id}`});
  };

  return (
    <div>
      {/* Fixed back button */}
      <div className="p-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm transition-colors hover:text-primary"
        >
          <MdArrowBack className="text-sm" />
          Back to Profile
        </button>
      </div>

      <div className="bg-background-light flex h-screen w-full overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <Header
            fullname={data?.user?.fullname}
            phoneNumber={data?.user?.phoneNumber}
            accountNumber={data?.accountNumber}
            eprivateAccount={wallet?.eprivateAccount}
            temporyAccount={wallet?.temporyAccount}
            avatarUrl={data?.photo}
          />

          {/* Page Title */}
          <div className="mb-6 flex items-end justify-between px-6 lg:px-10">
            <div>
              <h2 className="text-xl font-bold">Transaction History</h2>
              <p className="text-secondary-text text-sm">
                Detailed list of all movements
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow">
              <MdDownload />
              Statement
            </button>
          </div>

          <div className="px-6 lg:px-10">
            <TransactionFilters value={filters} onChange={setFilters} />
            <TransactionTable transactions={transactions} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
