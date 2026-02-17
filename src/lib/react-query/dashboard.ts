// import {useMutation, useQueryClient} from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import {dashGraph, getDashboardTopUpGrap} from '../api/dashboard';

// export const useGetDashToUpGraph = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: dashGraph) => getDashboardTopUpGrap(data),

//     onSuccess: () => {
//       // toast.success('fech data sucessfully!');
//       queryClient.invalidateQueries({queryKey: ['top-up-graph']});
//     },
//     onError: () => {
//       // toast.error('Failed To get data!');
//     },
//   });
// };
