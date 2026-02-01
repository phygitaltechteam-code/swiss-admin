export const getRequestStatus = (request: any) => {
  if (request?.user?.isRejected) return 'REJECTED';
  if (request?.user?.isVerified) return 'APPROVED';
  return 'PENDING';
};

export const statusColors: Record<string, string> = {
  PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
  APPROVED: 'bg-green-50 text-green-600 border-green-100',
  REJECTED: 'bg-red-50 text-red-600 border-red-100',
};
