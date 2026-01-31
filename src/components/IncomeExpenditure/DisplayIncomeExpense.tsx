import React, {Dispatch, FunctionComponent, SetStateAction} from 'react';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import {Link, useNavigate} from '@tanstack/react-router';
import {useAuthContext} from '@/context/AuthContext';
import {useGetAllIncomeExpense} from '@/lib/api/incomeExpenseApi';
import IncomeExpenditure from './IncomeExpenditure';
import {set} from 'lodash';
import {Route} from '@/routes/_app/manager/occassion.$id';

interface DisplayIncomeExpenseType {
  id: string;
  status: string;
  particular: string;
  amount: number;
  date: string;
  eventId: string;
  transactionId: string;
  bankName: string;
  receiptUrl?: string;
  billUrl?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Allow additional properties
  billNo?: string;
}

// Static columns
const columns: Column<any>[] = [
  {header: 'Date', accessor: 'date', sortable: true},
  {header: 'Particular', accessor: 'particular', sortable: true},
  {header: 'Amount', accessor: 'amount', sortable: true},
];

const DisplayIncomeExpense: FunctionComponent<{
  status: string;
  addNewModal: boolean;
  setAddNewModal: Dispatch<SetStateAction<boolean>>;
  editIncomeModal: boolean;
  setEditIncomeModal: Dispatch<SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<DisplayIncomeExpenseType>>;
}> = ({
  status,
  // addNewModal,
  // setAddNewModal,
  // editIncomeModal,
  setEditIncomeModal,
  setItems,
}: {
  status: string;
  // addNewModal: boolean;
  // setAddNewModal: Dispatch<SetStateAction<boolean>>;
  // editIncomeModal: boolean;
  setEditIncomeModal: Dispatch<SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<DisplayIncomeExpenseType>>;
}) => {
  const navigate = useNavigate();
  // console.log('status', status);

  const {user} = useAuthContext();
  const RoleId = user?.roleId;
  const {id: occId} = Route.useParams();

  const {data: IncomeExpenseData} = useGetAllIncomeExpense(occId as string);

  console.log('IncomeExpenseData', IncomeExpenseData);

  const filterData = (IncomeExpenseData ?? []).filter(
    (item) => item?.status === status,
  );

  const filteredData = filterData?.map((item) => ({
    date: new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(new Date(item.date)),
    particular: item.particular,
    amount: item.amount,
    id: item.id,
    status: item.status,
    eventId: item.eventId,
    transactionId: item.transactionId,
    bankName: item.bankName,
    receiptUrl: item.receiptUrl,
    billUrl: item.billUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    billNo: item.billNo,
  }));
  console.log('filteredData', filteredData);

  const handleEdit = (items: DisplayIncomeExpenseType) => {
    console.log('items', items);
    setEditIncomeModal(true);
    setItems(items);
    // navigate({
    //   to: `/update/incomeExpenditure/${items.id}`,
    //   state: {items: items},
    // });
  };

  const handleView = (items: DisplayIncomeExpenseType) => {
    navigate({
      to: `/manager/receiptbill/${occId}`,
      state: {myData: items} as any,
    });
    console.log('items', items);
  };

  return (
    <>
      <GenericTable
        title={status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        data={filteredData}
        columns={columns}
        itemsPerPage={5}
        action
        onEdit={handleEdit}
        {...(status === 'INCOME' ? {onView: handleView} : {})}
      />
    </>
  );
};

export default DisplayIncomeExpense;
