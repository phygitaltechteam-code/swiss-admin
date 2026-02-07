import React from 'react';
import {MdVisibility} from 'react-icons/md';

interface TransactionRow {
  id: string;
  date: string;
  time: string;
  recipient: string;
  type: string;
  amount: number;
  status: 'Pending' | 'Completed';
}

interface Props {
  transactions: TransactionRow[];
  loading?: boolean;
}

const TransactionTable: React.FC<Props> = ({transactions, loading}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center">
        Loading transactions...
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-xs font-bold uppercase">Date</th>
            {/* <th className="px-6 py-3 text-xs font-bold uppercase">
              Transaction ID
            </th> */}
            <th className="px-6 py-3 text-xs font-bold uppercase">Recipient</th>
            <th className="px-6 py-3 text-xs font-bold uppercase">Type</th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-xs font-bold uppercase">Status</th>
            {/* <th className="px-6 py-3 text-center text-xs font-bold uppercase">
              Action
            </th> */}
          </tr>
        </thead>

        <tbody className="divide-y">
          {transactions.map((trx) => (
            <tr key={trx.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium">{trx.date}</div>
                <div className="text-gray-500 text-xs">{trx.time}</div>
              </td>

              {/* <td className="px-6 py-4 font-mono text-xs">
                {trx.id}
              </td> */}

              <td className="px-6 py-4">{trx.recipient}</td>

              <td className="px-6 py-4">{trx.type}</td>

              <td className="px-6 py-4 text-right font-bold">
                <span
                  className={
                    trx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'
                  }
                >
                  {trx.amount > 0 ? '+' : '-'}${Math.abs(trx.amount).toFixed(2)}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    trx.status === 'Pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {trx.status}
                </span>
              </td>

              {/* <td className="px-6 py-4 text-center">
                <button className="rounded-full p-2 hover:bg-gray-100">
                  <MdVisibility />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
