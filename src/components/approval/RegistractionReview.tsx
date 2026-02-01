import React, {useState} from 'react';
import Header from './Header';
import SummaryChecklist from './SummaryCheckList';
import DecisionActions from './DesicionActions';
import ApplicantDetails from './ApplicantDetails';
import {Route} from '@/routes/_app/approval/registrationDetails.$id';
import {useGetCustomerById} from '@/lib/react-query/Customer';

const RegistrationReview: React.FC = () => {
  const {id} = Route.useParams();
  const {data: CustomerDetails} = useGetCustomerById(id);
  console.log('each customerrr', CustomerDetails);
  return (
    <div className="bg-subtle-pattern flex h-screen overflow-hidden">
      <main className="relative flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300">
        <Header />

        <div className="custom-scroll flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <SummaryChecklist
                SWIFTBIC={CustomerDetails?.SWIFTBIC}
                name={CustomerDetails?.user?.fullname}
                photo={CustomerDetails?.photo}
              />
              <DecisionActions />
            </div>

            <div className="lg:col-span-7">
              <ApplicantDetails customerDetails={CustomerDetails} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationReview;
