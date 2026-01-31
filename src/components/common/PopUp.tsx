import React, {createContext, useContext, useState} from 'react';

interface DepartmentEmployee {
  id: string;
  name: string;
  seniority: number;
}

interface AppContextType {
  createDepartment: boolean;
  position: boolean;
  positionList: boolean;
  displayDepartment: boolean;
  selectedProjectId: string;
  workPopup: boolean;
  projectWork: boolean;
  selectedDepartmentId: string;
  departEmp: DepartmentEmployee[];
  projectHeads: DepartmentEmployee[];
  copySop: boolean;
  empProjectWork: boolean;
  selectedProjectWorkId: string;
  setCopySop: (value: boolean) => void;
  setSelectedDepartmentId: (value: string) => void;
  setProjectWork: (value: boolean) => void;
  setWorkPopup: (value: boolean) => void;
  setSelectedProjectId: (value: string) => void;
  setCreateDepartment: (value: boolean) => void;
  setPositionList: (value: boolean) => void;
  setPosition: (value: boolean) => void;
  setDisplayDepartment: (value: boolean) => void;
  setDeptEmp: (value: DepartmentEmployee[]) => void;
  setProjectHeads: (value: DepartmentEmployee[]) => void;
  setEmpProjectWork: (value: boolean) => void;
  setSelectedProjectWorkId: (value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [createDepartment, setCreateDepartment] = useState(false);
  const [displayDepartment, setDisplayDepartment] = useState(false);
  const [position, setPosition] = useState(false);
  const [positionList, setPositionList] = useState(false);
  const [workPopup, setWorkPopup] = useState(false);
  const [projectWork, setProjectWork] = useState(false);
  const [empProjectWork, setEmpProjectWork] = useState(false);
  const [copySop, setCopySop] = useState(false);
  const [selectedProjectWorkId, setSelectedProjectWorkId] =
    useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [departEmp, setDeptEmp] = useState<DepartmentEmployee[]>([]);
  const [projectHeads, setProjectHeads] = useState<DepartmentEmployee[]>([]);

  return (
    <AppContext.Provider
      value={{
        position,
        positionList,
        createDepartment,
        displayDepartment,
        selectedProjectId,
        workPopup,
        projectWork,
        selectedDepartmentId,
        departEmp,
        projectHeads,
        copySop,
        empProjectWork,
        selectedProjectWorkId,
        setSelectedProjectWorkId,
        setCopySop,
        setProjectHeads,
        setSelectedDepartmentId,
        setProjectWork,
        setWorkPopup,
        setSelectedProjectId,
        setCreateDepartment,
        setPosition,
        setPositionList,
        setDisplayDepartment,
        setDeptEmp,
        setEmpProjectWork,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error('useAppContext must be used inside AppProvider');
  return context;
};
