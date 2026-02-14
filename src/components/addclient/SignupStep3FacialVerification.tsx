import type {FC} from 'react';
import {useState, useRef, useCallback} from 'react';
import {BiArrowBack} from 'react-icons/bi';
import {BsArrowRight} from 'react-icons/bs';
import {
  MdNoPhotography,
  MdReplay,
  MdUpload,
  MdCamera,
  MdLightMode,
  MdFace,
  MdPortrait,
} from 'react-icons/md';
import Webcam from 'react-webcam';
import React from 'react';

interface SignupStep3FacialVerificationProps {
  onComplete: (image: File | null) => void;
  onBack: () => void;
}

const SignupStep3FacialVerification: FC<SignupStep3FacialVerificationProps> = ({
  onComplete,
  onBack,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const webcamRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoConstraints = {
    facingMode: 'user',
    width: {ideal: 1280},
    height: {ideal: 720},
  };

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;

    setIsCapturing(true);

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setIsCapturing(false);
      return;
    }

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        if (blob.size === 0) throw new Error('Empty image');
        const file = new File([blob], 'face-verification.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        setTimeout(() => {
          setCapturedImage(file);
          setIsCapturing(false);
        }, 1000);
      })
      .catch((err) => {
        console.error('Capture failed:', err);
        setIsCapturing(false);
      });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsCapturing(true);
      setTimeout(() => {
        setCapturedImage(file);
        setIsCapturing(false);
      }, 1000);
    }
  };

  const handleContinueWithoutPhoto = () => {
    onComplete(null);
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
  };

  const handleComplete = () => {
    if (capturedImage) {
      onComplete(capturedImage);
    }
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dark:bg-gray-950 flex min-h-screen w-full justify-center bg-white font-['Inter'] antialiased selection:bg-[#F57F3D]/30 md:p-6">
      <div className="relative mx-auto w-full max-w-[min(390px,95vw,500px)] overflow-hidden rounded-2xl bg-white dark:bg-[#221610] md:min-h-[700px] md:max-w-[800px]">
        {/* Hidden file input for photo upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Background elements - simplified for white theme */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="from-[#F57F3D]/3 absolute -right-40 -top-40 size-[400px] rounded-full bg-gradient-to-br to-transparent blur-3xl" />
          <div className="from-[#F57F3D]/3 absolute -bottom-40 -left-40 size-[400px] rounded-full bg-gradient-to-tr to-transparent blur-3xl" />
        </div>

        {/* Sticky header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 p-4 pb-2 backdrop-blur-sm dark:bg-[#221610]/95 md:p-6 md:pb-3">
          <button
            onClick={onBack}
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-[#0d131c] transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 md:size-14"
          >
            <BiArrowBack className="text-2xl md:text-[26px]" />
          </button>
          <h2 className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#0d131c] dark:text-white md:text-xl">
            Verify Identity
          </h2>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-2 px-6 py-4 md:px-8 md:py-6">
          <div className="flex w-full flex-row items-center justify-center gap-2 md:gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-[#F57F3D]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#F57F3D]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#F57F3D]" />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 md:text-sm">
            Step 3 of 3 • Facial Verification
          </p>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-6 pb-32 pt-2 md:px-8 md:pb-8 md:pt-4">
          <div className="text-center">
            <h2 className="pb-3 text-[28px] font-bold leading-tight tracking-tight text-[#0d131c] dark:text-white md:text-[32px]">
              Facial Verification
            </h2>
            <p className="pb-6 text-base font-normal leading-normal text-slate-600 dark:text-slate-300 md:pb-8 md:text-lg">
              Position your face in the oval and take a photo. This helps
              prevent fraud and keep your account secure.
            </p>
          </div>

          {/* Facial capture area - tablet responsive */}
          <div className="mb-10 flex flex-col items-center justify-center md:mb-12">
            <div className="relative mx-auto h-[340px] w-[280px] md:h-[400px] md:w-[320px]">
              {/* Camera overlay frame */}
              <div
                className={`absolute inset-0 rounded-[40%] border-2 border-[#F57F3D] ${
                  isCapturing ? 'animate-pulse' : ''
                } pointer-events-none z-20 opacity-70`}
              />

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[40%] border-4 border-[#F57F3D] bg-white shadow-xl dark:bg-slate-900">
                {capturedImage ? (
                  <div className="flex h-full w-full flex-col items-center justify-center p-4">
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Captured face"
                      className="h-full w-full rounded-[40%] object-cover"
                    />
                    <div className="absolute top-6 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur-md md:top-8 md:px-5">
                      <p className="text-sm font-medium text-white md:text-base">
                        Captured
                      </p>
                    </div>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center justify-center p-4 md:p-6">
                    <MdNoPhotography className="mb-4 text-6xl text-amber-500 md:text-7xl" />
                    <p className="mb-2 text-center font-medium text-amber-600 md:text-lg">
                      Camera Error
                    </p>
                    <p className="px-4 text-center text-sm text-slate-600 dark:text-slate-300 md:text-base">
                      {cameraError}
                    </p>
                    <button
                      onClick={() => setCameraError(null)}
                      className="mt-4 rounded-lg bg-[#F57F3D] px-4 py-2 font-medium text-white transition-colors hover:bg-[#e06c2e] md:px-5 md:py-3"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      mirrored={true}
                      className="h-full w-full rounded-[40%] object-cover"
                      onUserMediaError={(err: MediaError) => {
                        setCameraError(
                          err.message ||
                            'Unable to access camera. Please check permissions and ensure a secure (HTTPS) connection.',
                        );
                        setCameraActive(false);
                      }}
                      onUserMedia={() => {
                        setCameraActive(true);
                        setCameraError(null);
                      }}
                    />
                    <div className="absolute top-6 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur-md md:top-8 md:px-5">
                      <p className="text-sm font-medium text-white md:text-base">
                        {isCapturing ? 'Processing...' : 'Looking Good'}
                      </p>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 text-center md:bottom-10">
                      <p className="text-sm font-medium text-white drop-shadow-md md:text-base">
                        Position your face in the frame
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Status message */}
            {isCapturing ? (
              <p className="mt-6 animate-pulse text-base font-semibold text-[#F57F3D] md:text-lg">
                Verifying identity...
              </p>
            ) : capturedImage ? (
              <p className="mt-6 text-base font-semibold text-green-600 md:text-lg">
                ✓ Photo captured successfully!
              </p>
            ) : cameraError ? (
              <p className="mt-6 text-base font-semibold text-amber-600 md:text-lg">
                Camera access required for auto-verification
              </p>
            ) : (
              <p className="mt-6 text-base font-semibold text-slate-600 md:text-lg">
                Ready to capture
              </p>
            )}
          </div>

          {/* Action buttons - tablet responsive */}
          <div className="mb-8 flex flex-col gap-4 md:mb-10">
            {capturedImage ? (
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={handleRetakePhoto}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#F57F3D] text-base font-semibold text-[#F57F3D] transition-colors hover:bg-[#F57F3D]/10 md:h-16 md:text-lg"
                >
                  <MdReplay className="text-[20px] md:text-[22px]" />
                  Retake Photo
                </button>
                <button
                  onClick={handleComplete}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#F57F3D] text-base font-semibold text-white shadow-[#F57F3D]/20 transition-colors hover:bg-[#e06c2e] md:h-16 md:text-lg"
                >
                  Continue
                  <BsArrowRight className="text-[20px] md:text-[22px]" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={handleUploadPhoto}
                  disabled={isCapturing}
                  className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#F57F3D] text-base font-semibold text-[#F57F3D] transition-colors ${
                    isCapturing
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-[#F57F3D]/10'
                  } md:h-16 md:text-lg`}
                >
                  <MdUpload className="text-[20px] md:text-[22px]" />
                  Upload Photo
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing || !!cameraError || !cameraActive}
                  className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#F57F3D] text-base font-semibold text-white shadow-[#F57F3D]/20 transition-colors ${
                    isCapturing || !!cameraError || !cameraActive
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-[#e06c2e]'
                  } md:h-16 md:text-lg`}
                >
                  <MdCamera className="text-[20px] md:text-[22px]" />
                  {isCapturing ? 'Processing...' : 'Capture'}
                </button>
              </div>
            )}
          </div>

          {/* Continue without photo */}
          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800 md:mt-10">
            <p className="mb-4 text-center text-slate-600 dark:text-slate-400 md:text-lg">
              Having trouble with the camera?
            </p>
            <button
              onClick={handleContinueWithoutPhoto}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 text-base font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50 md:h-16 md:text-lg"
            >
              <BsArrowRight className="text-[20px] md:text-[22px]" />
              Continue Without Photo
              <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                (Optional)
              </span>
            </button>
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400 md:text-sm">
              You can complete verification later in your account settings
            </p>
          </div>

          {/* Tips - tablet responsive */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4">
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/50 md:p-5">
              <MdLightMode className="mb-2 text-2xl text-[#F57F3D] md:text-3xl" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 md:text-base">
                Good Lighting
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                Face a light source
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/50 md:p-5">
              <MdFace className="mb-2 text-2xl text-[#F57F3D] md:text-3xl" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 md:text-base">
                Neutral Face
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                No glasses or hats
              </p>
            </div>
            <div className="col-span-2 flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/50 md:col-span-1 md:p-5">
              <MdPortrait className="mb-2 text-2xl text-[#F57F3D] md:text-3xl" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 md:text-base">
                Center Position
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                Face centered in oval
              </p>
            </div>
          </div>
        </div>

        {/* Fixed bottom bar - tablet responsive */}
        <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-[min(390px,95vw,500px)] border-t border-slate-100 bg-white/95 p-6 backdrop-blur-md dark:border-slate-800 dark:bg-[#221610]/80 md:relative md:mt-6 md:max-w-[800px] md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="flex flex-col items-center gap-4 md:px-8 md:pb-6">
            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <div
                className={`h-2 w-2 rounded-full md:h-3 md:w-3 ${cameraActive ? 'animate-pulse bg-green-500' : 'bg-amber-500'}`}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                {cameraActive ? 'Camera active' : 'Camera not active'}
              </span>
            </div>

            {/* Helper text for tablet */}
            <p className="hidden text-center text-sm text-slate-500 dark:text-slate-400 md:block">
              Ensure your face is clearly visible in the oval frame for best
              results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupStep3FacialVerification;
