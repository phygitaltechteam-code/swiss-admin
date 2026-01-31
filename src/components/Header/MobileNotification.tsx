/*eslint-disable*/
import React, {useEffect, useState} from 'react';
import {Link} from '@tanstack/react-router';
import ClickOutside from '../ClickOutside';
import {useAuthContext} from '@/context/AuthContext';
import {
  useAcceptNotification,
  useDeleteFollowUp,
  useEditPayment,
  useGetOcassionFollowUp,
  useNotification,
  useUpdateFollowUp,
} from '@/lib/api/adminApi';
import {
  Bell,
  BellOff,
  Calendar,
  User,
  Phone,
  DollarSign,
  Clock,
  CheckCircle2,
  Trash,
} from 'lucide-react';
import {CheckmarkIcon} from 'react-hot-toast';
import {FaEdit} from 'react-icons/fa';
import {FaWhatsapp} from 'react-icons/fa6';

interface mobileProps {
  showNotification: boolean;
  setShowNotification: (open: boolean) => void;
}

interface Notification {
  id: string;
  eventName: string;
  particular: string;
  clientName: string;
  clientNumber: string;
  amount: number;
  date: string;
}

const MobileNotification = ({
  showNotification,
  setShowNotification,
}: mobileProps) => {
  const {user} = useAuthContext();

  const [notifying, setNotifying] = useState(true);
  const {data: notificationData} = useNotification(user?.roleId!);
  const {data: followUpData} = useGetOcassionFollowUp();
  const {mutateAsync: updateFollowUp} = useUpdateFollowUp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  console.log('selectedd', selectedDate);
  const {mutateAsync: deleteFollowUp} = useDeleteFollowUp();
  const safeNotifications = Array.isArray(notificationData)
    ? notificationData
    : [];
  const {mutateAsync: acceptNotification} = useAcceptNotification();
  const {mutateAsync: editPaymentDetail} = useEditPayment();
  const [isPaymentEditModalOpen, setIsPaymentEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [editPayment, setEditPayment] = useState(null);

  const safeFollowUp = Array.isArray(followUpData) ? followUpData : [];

  const sortedNotifications = [...safeNotifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  console.log('paymet opennnn', isPaymentEditModalOpen);
  console.log('paymet selected.....', editPayment);

  useEffect(() => {
    if (selectedPayment) {
      setEditPayment({...selectedPayment});
    }
  }, [selectedPayment]);

  const sortedFollowUp = [...safeFollowUp].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  console.log('sorted followw', sortedFollowUp);

  const today = new Date();
  const todayString = today.toDateString();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const isToday = date.toDateString() === todayString;
    const isYesterday =
      new Date(today.setDate(today.getDate() - 1)).toDateString() ===
      date.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year:
          date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const notificationCount = sortedNotifications.length;

  const followUpNotifications = sortedFollowUp
    .map((item) => {
      const last =
        item.ocassionfollowupDate?.[item.ocassionfollowupDate.length - 1];
      return last
        ? {
            occasionName: item.name,
            followupDate: last.followupDate,
            istaken: last.istaken,
            id: last.id,
          }
        : null;
    })
    .filter(Boolean)

    .filter((item) => {
      const followupDate = new Date(item.followupDate);
      // remove time part for accurate comparison
      const followupDay = new Date(
        followupDate.getFullYear(),
        followupDate.getMonth(),
        followupDate.getDate(),
      );
      const todayDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      return followupDay <= todayDay;
    });

  const followUpCount = followUpNotifications.length;
  console.log('folo countttttt', followUpCount);

  const edit = () => {
    updateFollowUp({data: selectedItem, id: selectedItem.id});
  };

  const shareToWhatsApp = (item: Notification) => {
    if (
      !item?.id ||
      !item.clientName ||
      !item.clientNumber ||
      !item.eventName ||
      !item.particular ||
      !item.amount
    ) {
      console.error('Missing required fields for WhatsApp share:', item);
      return;
    }
    console.log('Sharing to WhatsApp:', item);
    const message = `Hello ${item.clientName},\nThis is a reminder regarding your event "${item.eventName}".\nDetails: ${item.particular}\nPending Amount: ₹${Number(item.amount).toLocaleString('en-IN')}\nKindly complete the payment at the earliest.\nThank you 🙏`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${item.clientNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const paymentEdit = () => {
    const data = {
      date: editPayment?.date,
      particular: editPayment?.particular,
      amount: Number(editPayment?.amount),
      status: editPayment?.status,
    };
    editPaymentDetail({data: data, id: selectedPayment?.id});
  };

  const deleteFollowUpDate = (data: any) => {
    deleteFollowUp({id: data.id});
  };
  return (
    <>
      {' '}
      <li className="relative">
        {showNotification && (
          <div className="-right-50 w-96 rounded-2xl border border-stroke bg-white shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out dark:border-strokedark dark:bg-boxdark">
            <div className="rounded-t-2xl border-b border-stroke bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 dark:border-strokedark">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h5 className="text-lg font-bold text-white">
                        Payment Notifications
                      </h5>
                    </div>
                    <button
                      onClick={() => setShowNotification(false)}
                      className="hover:text-gray-300 absolute right-3 top-3 text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {sortedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12">
                  <div className="bg-gray-100 mb-4 flex h-16 w-16 items-center justify-center rounded-full dark:bg-meta-4">
                    <BellOff className="text-gray-400 h-8 w-8" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                    No notifications yet
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                    We'll notify you when something arrives
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {sortedNotifications.map((notification, index) => (
                    <div key={index} className="group relative mb-2 last:mb-0">
                      <Link
                        className="relative flex transform flex-col gap-3 rounded-xl border border-transparent bg-white p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg dark:bg-boxdark-2 dark:hover:border-blue-800 dark:hover:from-meta-4 dark:hover:to-purple-900/20"
                        to="/"
                      >
                        {/* Notification Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h6 className="text-gray-900 font-bold dark:text-white">
                                {notification.eventName}
                              </h6>
                              <div className="mt-1 flex items-center gap-2">
                                <Clock className="text-gray-400 h-3 w-3" />
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  {formatDate(notification.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-blue-500 transition-colors duration-200 group-hover:bg-purple-500"></div>
                        </div>

                        {/* Notification Message */}
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {notification.particular}
                        </p>

                        {/* Client Information */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <User className="text-gray-400 h-4 w-4" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                {notification.clientName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="text-gray-400 h-4 w-4" />
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                {notification.clientNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Amount and Status */}
                        <div className="border-gray-100 dark:border-gray-800 flex items-center justify-between border-t pt-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              ₹{notification.amount}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 sm:gap-2 sm:px-3 sm:text-sm"
                            title="Accept"
                            onClick={() => acceptNotification(notification.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Accept</span>
                          </button>

                          <button
                            className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:gap-2 sm:px-3 sm:text-sm"
                            title="Edit"
                            onClick={() => {
                              setIsPaymentEditModalOpen(true);
                              setSelectedPayment(notification);
                              console.log('editttt', edit);
                            }}
                          >
                            <FaEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Edit</span>
                          </button>

                          <button
                            className="flex items-center gap-1 rounded-md bg-green-500 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 sm:gap-2 sm:px-3 sm:text-sm"
                            title="Share to WhatsApp"
                            onClick={() => shareToWhatsApp(notification)}
                          >
                            <FaWhatsapp className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Follow-up Notifications Section */}
            {followUpNotifications.length > 0 && (
              <>
                {/* Follow-up Header */}
                <div className="border-t border-stroke bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 dark:border-strokedark">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <Calendar className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          Follow-up Reminders
                        </h5>
                        <p className="text-xs text-amber-100">
                          {followUpCount} pending follow-up
                          {followUpCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <span className="text-xs font-bold text-white">
                        {followUpCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow-up Notifications */}
                <div className="max-h-48 overflow-y-auto border-t border-stroke dark:border-strokedark">
                  <div className="p-2">
                    {followUpNotifications.map((fu, index) => (
                      <div
                        key={`fu-${index}`}
                        className="group relative mb-2 last:mb-0"
                      >
                        <div className="relative flex transform flex-col gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                                <Calendar className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h6 className="text-gray-900 text-sm font-bold dark:text-white">
                                  Follow-up: {fu.occasionName}
                                </h6>
                                <div className="mt-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3 text-amber-400" />
                                  <span className="text-gray-600 dark:text-gray-400 text-xs">
                                    {formatDate(fu.followupDate)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`h-2 w-2 rounded-full ${
                                fu.istaken
                                  ? 'bg-green-500'
                                  : 'animate-pulse bg-amber-500'
                              }`}
                            ></div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 sm:gap-2 sm:px-3 sm:text-sm"
                              title="Edit"
                              onClick={() => {
                                setSelectedDate(fu);
                                setIsEditModalOpen(true);
                                setSelectedItem(fu);
                              }}
                            >
                              <FaEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>Edit</span>
                            </button>

                            <button
                              className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 sm:gap-2 sm:px-3 sm:text-sm"
                              title="Delete"
                              onClick={() => {
                                deleteFollowUpDate(fu);
                              }}
                            >
                              <Trash className="h-3 w-3 sm:h-4 sm:w-4" />{' '}
                              {/* use Trash icon */}
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            {(sortedNotifications.length > 0 ||
              followUpNotifications.length > 0) && (
              <div className="bg-gray-50 rounded-b-2xl border-t border-stroke px-6 py-3 dark:border-strokedark dark:bg-meta-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {sortedNotifications.length + followUpNotifications.length}{' '}
                    total items
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </li>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-80">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Edit Follow Up Date
              </h2>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  value={
                    selectedItem.followupDate
                      ? selectedItem.followupDate.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      followupDate: e.target.value,
                    })
                  }
                  className="w-full rounded border border-stroke px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Note
                </label>
                <input
                  type="text"
                  value={selectedItem.note ? selectedItem.note : ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      note: e.target.value,
                    })
                  }
                  className="w-full rounded border border-stroke px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-stroke p-6 dark:border-strokedark">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="hover:bg-gray-100 rounded border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  edit();
                }}
                className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {isPaymentEditModalOpen && editPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-boxdark sm:max-w-md">
            {/* Header */}
            <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
              <h2 className="text-base font-semibold text-black dark:text-white sm:text-lg">
                Edit Notification
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-3 p-4 sm:p-6">
              {/* Date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  value={editPayment.date ? editPayment.date.split('T')[0] : ''}
                  onChange={(e) =>
                    setEditPayment({...editPayment, date: e.target.value})
                  }
                  className="w-full rounded border border-stroke px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>

              {/* Particular */}
              <div>
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Particular
                </label>
                <input
                  type="text"
                  value={editPayment.particular || ''}
                  onChange={(e) =>
                    setEditPayment({...editPayment, particular: e.target.value})
                  }
                  className="w-full rounded border border-stroke px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Amount
                </label>
                <input
                  type="number"
                  value={editPayment.amount ?? ''}
                  onChange={(e) =>
                    setEditPayment({
                      ...editPayment,
                      amount:
                        e.target.value === '' ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full rounded border border-stroke px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-stroke p-4 dark:border-strokedark sm:p-6">
              <button
                onClick={() => setIsPaymentEditModalOpen(false)}
                className="hover:bg-gray-100 rounded border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPaymentEditModalOpen(false);
                  paymentEdit(editPayment);
                }}
                className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNotification;
