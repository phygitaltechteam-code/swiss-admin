import React, {useState} from 'react';
import Header from './Header';
import SummaryChecklist from './SummaryCheckList';
import DecisionActions from './DesicionActions';
import ApplicantDetails from './ApplicantDetails';

const RegistrationReview: React.FC = () => {
  return (
    <div className="bg-subtle-pattern flex h-screen overflow-hidden">
      <main className="relative flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300">
        <Header />

        <div className="custom-scroll flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Summary & Actions */}
            <div className="flex flex-col gap-6 lg:col-span-5">
              <SummaryChecklist />
              <DecisionActions />
            </div>

            {/* Right Column: Applicant Details */}
            <div className="lg:col-span-7">
              <ApplicantDetails />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationReview;
