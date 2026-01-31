import React, {useEffect, useMemo, useState} from 'react';
import {useAuthContext} from '@/context/AuthContext';
import {useEmployeeFunctions} from '@/lib/api/employeeApi';
import {useOccasions} from '@/lib/api/occassionApi';
import {Navigate, useNavigate} from '@tanstack/react-router';

const EmpCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {user} = useAuthContext();
  const navigate = useNavigate();

  const {data: empFunctions} = useEmployeeFunctions(user?.roleId as string);
  const filteredEmpFunctions = useMemo(
    () =>
      empFunctions?.reduce((acc, curr) => {
        const isDuplicate = acc.some((item) => item.id === curr.id);
        if (!isDuplicate) acc.push(curr);
        return acc;
      }, []),
    [empFunctions],
  );

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const renderDays = () => {
    const calendarCells = [];
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const totalCells = startDay + daysInMonth;

    for (let i = 0; i < totalCells; i++) {
      if (i < startDay) {
        calendarCells.push(<td key={`empty-${i}`}></td>);
      } else {
        const day = i - startDay + 1;
        const dateObj = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day,
        );
        const dateKey = dateObj.toISOString().split('T')[0];

        const functionsOnDate = filteredEmpFunctions?.filter((func) => {
          const start = new Date(func.startDate);
          const end = new Date(func.endDate);
          return dateObj >= start && dateObj <= end;
        });

        calendarCells.push(
          <td
            key={day}
            className="relative min-h-[7.75rem] border border-stroke p-2 align-top dark:border-strokedark"
            // onClick={() => {
            //   console.log(`Selected date: ${dateKey}`);
            // }}
          >
            <div className="font-medium text-black dark:text-white">{day}</div>
            <div className="absolute left-0 right-0 top-8 space-y-1">
              {functionsOnDate?.map((func, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer truncate bg-blue-500 px-1 text-[10px] font-semibold text-white hover:bg-blue-600"
                  onClick={() => {
                    console.log(`Function: ${func.name} on ${dateKey}`);
                    navigate({
                      to: `/employee/worklist/${func.id}`,
                    });
                  }}
                >
                  {func.name}
                </div>
              ))}
            </div>
          </td>,
        );
      }
    }

    const rows = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
      rows.push(
        <tr key={i} className="grid grid-cols-7">
          {calendarCells.slice(i, i + 7)}
        </tr>,
      );
    }

    return rows;
  };

  return (
    <div className="md:m-8">
      <div className="flex items-center justify-between bg-primary p-4">
        <button onClick={prevMonth} className="text-xl font-bold text-white">
          ←
        </button>
        <h2 className="text-xl font-semibold text-white">
          {currentDate.toLocaleString('default', {month: 'long'})}{' '}
          {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="text-xl font-bold text-white">
          →
        </button>
      </div>

      <div className="w-full max-w-full rounded-sm bg-white shadow-default dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <th
                  key={day}
                  className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderDays()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpCalendar;
