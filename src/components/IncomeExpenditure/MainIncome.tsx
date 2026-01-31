import React, {useEffect, useState} from 'react';
import IncomeExpenditure from './IncomeExpenditure';
import DisplayIncomeExpense from './DisplayIncomeExpense';
import {IncomeExpense} from '@/types';
import {Home} from '@/pages';
import {useOccasionById} from '@/lib/api/occassionApi';
import {useGetClientById} from '@/lib/api/clientApi';
import {Route} from '@/routes/_app/manager/occassion.$id';
import {useGetAmounts} from '@/lib/api/incomeExpenseApi';
import {useAuthContext} from '@/context/AuthContext';

type clientType = {
  user?: {
    fullname: string;
    phoneNumber: string;
    secondaryPhoneNumber?: string;
  };
  fullname: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  address: string;
  panNumber?: string;
  caste?: string;
  createdAt?: string;
  updatedAt?: string;
};

const MainIncome = () => {
  const [addNewModal, setAddNewModal] = useState(false);
  const [editIncomeModal, setEditIncomeModal] = useState(false);
  const [items, setItems] = useState({});
  const [clientData, setClientData] = useState<clientType>();

  const {id: occId} = Route.useParams();
  const {data: totalAmounts} = useGetAmounts(occId as string);
  console.log('totalsss', totalAmounts);
  const {data: occasionData} = useOccasionById(occId as string);
  // console.log('Occasion Data:', occasionData);
  const {data: clientsData} = useGetClientById(
    occasionData?.clientId! as string,
  );
  const {user} = useAuthContext();

  useEffect(() => {
    if (clientsData) {
      setClientData(clientsData);
    }
  }, [clientsData]);
  console.log('Client Data:', clientData);

  console.log('items-------------------', items);

  return (
    <div>
      <div className="col-span-12 flex items-center justify-end rounded-sm pb-2 pt-4 dark:border-strokedark dark:bg-boxdark">
        <button
          onClick={() => {
            setAddNewModal(!addNewModal);
            setEditIncomeModal(false);
          }}
          className="flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 lg:px-8"
        >
          + Add New
        </button>
      </div>

      {addNewModal && <IncomeExpenditure setAddNewModal={setAddNewModal} />}

      {editIncomeModal && (
        <IncomeExpenditure
          editIncomeModal={editIncomeModal}
          setEditIncomeModal={setEditIncomeModal}
          items={items}
        />
      )}

      {!addNewModal && !editIncomeModal && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <DisplayIncomeExpense
            status={IncomeExpense.Income}
            addNewModal={addNewModal}
            setAddNewModal={setAddNewModal}
            editIncomeModal={editIncomeModal}
            setEditIncomeModal={setEditIncomeModal}
            setItems={setItems}
          />
          <DisplayIncomeExpense
            status={IncomeExpense.Receivable}
            addNewModal={addNewModal}
            setAddNewModal={setAddNewModal}
            editIncomeModal={editIncomeModal}
            setEditIncomeModal={setEditIncomeModal}
            setItems={setItems}
          />
          {/* <DisplayIncomeExpense
            status={IncomeExpense.Expense}
            addNewModal={addNewModal}
            setAddNewModal={setAddNewModal}
            editIncomeModal={editIncomeModal}
            setEditIncomeModal={setEditIncomeModal}
            setItems={setItems}
          /> */}
          {/* <DisplayIncomeExpense
            status={IncomeExpense.Payable}
            addNewModal={addNewModal}
            setAddNewModal={setAddNewModal}
            editIncomeModal={editIncomeModal}
            setEditIncomeModal={setEditIncomeModal}
            setItems={setItems}   
          /> */}
        </div>
      )}
    </div>
  );
};

export default MainIncome;
