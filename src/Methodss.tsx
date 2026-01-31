const getStatusColors = (status: string) => {
  const s = status?.toLowerCase();

  return s === 'done'
    ? 'bg-green-100 text-green-700'
    : s === 'pending'
      ? 'bg-yellow-100 text-yellow-700'
      : s === 'working'
        ? 'bg-blue-100 text-blue-700'
        : s === 'review'
          ? 'bg-orange-100 text-orange-700'
          : s === 'delayed'
            ? 'bg-red-100 text-red-700'
            : s === 'canceled'
              ? 'bg-gray-100 text-gray-700'
              : s === 'reopen'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700';
};
