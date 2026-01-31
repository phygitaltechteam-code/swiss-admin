import React, {useEffect, useState} from 'react';
import MainIncome from '../IncomeExpenditure/MainIncome';
import {useAuthContext} from '@/context/AuthContext';
import toast from 'react-hot-toast';
const SerialIndex: React.FC = () => {
  const [activeStep, setActiveStep] = useState(
    parseInt(window.sessionStorage.getItem('activeStep') || '0', 10),
  );

  const {user} = useAuthContext();

  useEffect(() => {
    window.sessionStorage.setItem('activeStep', activeStep.toString());
  }, [activeStep]);

  // Steps Array
  const steps = ['Booking', 'RawBill', 'Bill', 'Receipts'];

  // Step click handler
  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  // Render content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <MainIncome />;

      case 1:
        return <MainIncome />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="mx-auto p-1 md:p-6">
      {/* Stepper */}
      <div className="scrollbar-hide mb-6 overflow-x-auto whitespace-nowrap">
        <div className="flex justify-start pl-4 pr-4">
          <div className="flex min-w-max space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold shadow-md transition-all duration-300 dark:bg-boxdark ${
                    activeStep === index
                      ? 'scale-110 bg-blue-600 text-blue-600'
                      : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
                <p
                  className={`mt-2 text-xs md:text-sm ${activeStep === index ? 'font-medium text-blue-600' : 'text-graydark dark:text-gray'}`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="mb-6 overflow-auto">{renderStepContent()}</div>
    </div>
  );
};

export default SerialIndex;
