import {Dispatch, SetStateAction} from 'react';

export interface WorkItemProps {
  work: any;
  func: any;
  register: any;
  imageInputs: Record<string, File | null>;
  setImageInputs: Dispatch<SetStateAction<Record<string, File | null>>>;
  showNotes: Record<string, boolean>;
  setShowNotes: Dispatch<SetStateAction<Record<string, boolean>>>;
  handleImageSave?: (workId: string, funcId: string) => void;
  handleSingleWorkSave?: () => void;
  isExtraWork?: boolean;
  base?: string;
  showImageSaveButton?: boolean;
  startDate?: string;
  endDate?: string;
  deselectedImages: Record<string, string[]>;
  setDeselectedImages: Dispatch<SetStateAction<Record<string, string[]>>>;
}

export interface PackageWorksProps {
  allWorks: any[];
  register: any;
  imageInputs: Record<string, File | null>;
  setImageInputs: Dispatch<SetStateAction<Record<string, File | null>>>;
  showNotes: Record<string, boolean>;
  setShowNotes: Dispatch<SetStateAction<Record<string, boolean>>>;
  handleSingleWorkSave: (workId: string, funcId: string) => void;
  getValues: any;
  occassionId: string;
  startDate?: string;
  endDate?: string;
}

export interface ExtraItemsAdminProps {
  form: any;
  register: any;
  handleItemQuantitySave: (itemId: string) => void;
  startDate?: string;
  endDate?: string;
}

export interface ExtraWorksProps {
  works: any[];
  allWorks: any[];
  register: any;
  control: any;
  extraWorkFields: any[];
  addExtraWork: (work: any) => void;
  removeExtraWork: (index: number) => void;
  handleExtraWorkSave: (index: number) => void;
  selectedExtraWorkId: string;
  setSelectedExtraWorkId: Dispatch<SetStateAction<string>>;
  imageInputs: Record<string, File | null>;
  setImageInputs: Dispatch<SetStateAction<Record<string, File | null>>>;
  showNotes: Record<string, boolean>;
  setShowNotes: Dispatch<SetStateAction<Record<string, boolean>>>;
  startDate?: string;
  endDate?: string;
}

export interface ExtraItemsProps {
  items: any[];
  register: any;
  control: any;
  extraItemsFields: any[];
  addExtraItem: (item: any) => void;
  removeExtraItem: (index: number) => void;
  handleExtraItemSave: (index: number) => void;
  selectedItemId: string;
  setSelectedItemId: Dispatch<SetStateAction<string>>;
  startDate?: string;
  endDate?: string;
}
