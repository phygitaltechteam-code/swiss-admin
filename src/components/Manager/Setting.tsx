// import {useAuthContext} from '@/context/AuthContext';
// // import {useGetAdminProfile} from '@/lib/api/adminApi';
// import {useSaveRoomTime} from '@/lib/react-query/banquet';
// import React, {useEffect, useState} from 'react';

// const Setting = () => {
//   const {user} = useAuthContext();
//   const {mutateAsync: saveRoomTime} = useSaveRoomTime();

//   // const {data: adminInfo} = useGetAdminProfile(user?.roleId!);
//   // console.log('profileee', adminInfo);
//   const [roomTime, setRoomTime] = useState({
//     startTime: '',
//     endTime: '',
//     startDate: '',
//     endDate: '',
//   });
//   useEffect(() => {
//     if (false) {
//       // const {roomStartTime, roomEndTime} = adminInfo;

//       const start = new Date(roomStartTime);
//       const end = new Date(roomEndTime);

//       setRoomTime({
//         startDate: start.toISOString().split('T')[0],
//         startTime: start.toISOString().split('T')[1].slice(0, 5),
//         endDate: end.toISOString().split('T')[0],
//         endTime: end.toISOString().split('T')[1].slice(0, 5),
//       });
//     }
//   }, [adminInfo]);

//   const onSubmit = () => {
//     const startISO = new Date(
//       `${roomTime.startDate}T${roomTime.startTime}:00.000Z`,
//     ).toISOString();
//     const endISO = new Date(
//       `${roomTime.endDate}T${roomTime.endTime}:00.000Z`,
//     ).toISOString();
//     saveRoomTime({endTime: endISO, startTime: startISO});
//   };

//   return (
//     <div className="mt-4 bg-white p-6 dark:bg-boxdark">
//       <p className="mb-6 text-2xl font-semibold dark:text-white">Setting</p>
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <label className="text-gray-700 mb-1 block text-sm font-medium dark:text-white">
//             Start Date
//           </label>
//           <input
//             type="date"
//             value={roomTime?.startDate}
//             onChange={(e) => {
//               setRoomTime((prev) => ({
//                 ...prev,
//                 startDate: e.target.value,
//               }));
//             }}
//             className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//           />
//         </div>
//         <div>
//           <label className="text-gray-700 mb-1 block text-sm font-medium dark:text-white">
//             End Date
//           </label>
//           <input
//             type="date"
//             value={roomTime?.endDate}
//             onChange={(e) => {
//               setRoomTime((prev) => ({
//                 ...prev,
//                 endDate: e.target.value,
//               }));
//             }}
//             className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//           />
//         </div>
//         <div>
//           <label className="text-gray-700 mb-1 block text-sm font-medium dark:text-white">
//             Start Time
//           </label>
//           <input
//             type="time"
//             value={roomTime?.startTime}
//             onChange={(e) => {
//               setRoomTime((prev) => ({
//                 ...prev,
//                 startTime: e.target.value,
//               }));
//             }}
//             className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//           />
//         </div>
//         <div>
//           <label className="text-gray-700 mb-1 block text-sm font-medium dark:text-white">
//             End Time
//           </label>
//           <input
//             type="time"
//             value={roomTime?.endTime}
//             onChange={(e) => {
//               setRoomTime((prev) => ({
//                 ...prev,
//                 endTime: e.target.value,
//               }));
//             }}
//             className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//           />
//         </div>
//       </div>
//       <div className="mt-4">
//         {' '}
//         <button
//           className="rounded-md bg-blue-700 px-4 py-2 text-white"
//           onClick={onSubmit}
//         >
//           save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Setting;
