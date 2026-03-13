import React, {useState} from 'react';
import Header from './Header';
import SummaryChecklist from './SummaryCheckList';
import DecisionActions from './DesicionActions';
import ApplicantDetails from './ApplicantDetails';
import {Route} from '@/routes/_app/approval/registrationDetails.$id';
import {
  useAcceptCustomer,
  useGetCustomerById,
  useRejectCustomer,
} from '@/lib/react-query/Customer';
import {getRequestStatus} from './methods';

const RegistrationReview: React.FC = () => {
  const {id} = Route.useParams();
  const {data: CustomerDetails} = useGetCustomerById(id);
  const {mutateAsync: acceptCustomer} = useAcceptCustomer();
  const {mutateAsync: rejectCustomer} = useRejectCustomer();
  const status = getRequestStatus(CustomerDetails);
  console.log('each customerrr', CustomerDetails);

  return (
    <div className="bg-subtle-pattern flex h-screen overflow-hidden">
      <main className="relative flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300">
        <Header status={status} />

        <div className="custom-scroll overflow-y-auto p-4 md:p-6">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
            <div>
              <ApplicantDetails customerDetails={CustomerDetails} />
            </div>

            {status === 'PENDING' && (
              <div className="flex flex-col gap-6">
                <DecisionActions
                  onAccept={() => acceptCustomer(id)}
                  onReject={(note: string) => rejectCustomer({id, note})}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationReview;
