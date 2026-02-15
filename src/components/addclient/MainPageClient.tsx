/*eslint-disable*/
import React, {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {unAuthenticatedApi} from '@/utils/axios'; // assuming this is your unauth axios instance

import {useNavigate} from '@tanstack/react-router';
import {AxiosError} from 'axios';
import SignupStep1Personal from './SignupStep1Personal';
import SignupStep2KYCUpload from './SignupStep2KYCUpload';
import SignupStep3FacialVerification from './SignupStep3FacialVerification';

export interface PersonalData {
  accountHolderName: string;
  dateOfBirth: string;
  nationality: string;
  swiftBicCode: string;
  countryOfAccount: string;
  contactEmail: string;
  contactPhone: string;
  phoneCode: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  password: string;
  securityPin: string;
}

export interface KYCDocument {
  type: 'Passport';
  number: string;
  file: File | null;
}

export interface FacialVerificationData {
  image: File | null;
}

const MainPageClient = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [personalData, setPersonalData] = useState<PersonalData>({
    accountHolderName: '',
    dateOfBirth: '',
    nationality: '',
    swiftBicCode: '',
    countryOfAccount: '',
    contactEmail: '',
    contactPhone: '',
    phoneCode: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'IN',
    password: '',
    securityPin: '',
  });

  const [kycDocument, setKycDocument] = useState<KYCDocument>({
    type: 'Passport',
    number: '',
    file: null,
  });

  const [facialVerification, setFacialVerification] =
    useState<FacialVerificationData>({
      image: null,
    });

  const signupMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await unAuthenticatedApi.post(
        '/users/register',
        formData,
        {
          // Optional: track upload progress (useful for large files)
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              console.log(`Upload progress: ${percent}%`);
            }
          },
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      console.log('Registration successful:', data);
      navigate({
        to: '/Approval/customerregisterapprove',
      });
    },

    onError: (error: AxiosError<any>) => {
      const message = error.response?.data?.message || 'Login failed';
      if (message === 'Pending') {
        navigate({
          to: '/Approval/customerregisterapprove',
        });
      }
      if (message === 'Rejected') {
        navigate({
          to: '/Approval/customerregisterapprove',
        });
      }
    }, // Added missing comma and closing brace
  });

  const handleStep1Complete = (data: Partial<PersonalData>) => {
    setPersonalData((prev) => ({...prev, ...data}));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Partial<KYCDocument>) => {
    setKycDocument((prev) => ({...prev, ...data}));
    setCurrentStep(3);
  };

  const handleStep3Complete = (image: File | null) => {
    setFacialVerification({image});

    const formData = new FormData();
    formData.append('fullname', personalData.accountHolderName.trim() || '');
    formData.append('email', personalData.contactEmail.trim() || '');
    formData.append('username', personalData.contactEmail.split('@')[0] || ''); // or have separate username field
    formData.append('password', personalData.password || '');
    formData.append(
      'phoneNumber',
      `${personalData.contactPhone.trim()}`.replace(/\s+/g, ''),
    );
    formData.append('dob', personalData.dateOfBirth || ''); // yyyy-mm-dd
    // formData.append('nationality', personalData.nationality || 'Indian');
    formData.append('address', personalData.streetAddress.trim() || '');
    formData.append('city', personalData.city.trim() || '');
    formData.append('state', personalData.stateProvince.trim() || '');
    formData.append('country', personalData.country || 'India');
    formData.append('pincode', personalData.postalCode.trim() || '');
    formData.append('securityPin', personalData.securityPin.trim() || '');
    // formData.append('SWIFTBIC', personalData.swiftBicCode || '');
    formData.append('role', 'CUSTOMER');
    // formData.append('documentNumber', '');
    if (kycDocument.type === 'Passport') {
      formData.append('documentType', 'Passport');
      formData.append('documentNumber', kycDocument.number.toUpperCase());
      if (kycDocument.file) {
        formData.append('passport', kycDocument.file); // or passportCard
      }
    }
    if (image) {
      formData.append('photo', image, image.name || 'selfie.jpg');
    }
    signupMutation.mutate(formData);
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
  };

  return (
    <div>
      {currentStep === 1 && (
        <SignupStep1Personal
          initialData={personalData}
          onComplete={handleStep1Complete}
          onBack={() => {}}
        />
      )}

      {currentStep === 2 && (
        <SignupStep2KYCUpload
          initialData={kycDocument}
          onComplete={handleStep2Complete}
          onBack={() => goToStep(1)}
        />
      )}

      {currentStep === 3 && (
        <SignupStep3FacialVerification
          onComplete={handleStep3Complete}
          onBack={() => goToStep(2)}
        />
      )}

      {/* Optional: show loading state during submission */}
      {signupMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-white">
            <p className="text-lg font-medium">Creating your account...</p>
            <div className="bg-gray-200 mt-4 h-2 w-64 overflow-hidden rounded">
              <div
                className="h-full animate-pulse bg-orange-500"
                style={{width: '60%'}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPageClient;
