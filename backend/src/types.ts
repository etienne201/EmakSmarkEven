import { Language } from "./translations";

export interface Guest {
  id: number;
  uuid?: string;
  title: string;
  name: string;
  table: number;
  tableName: string;
  lang: Language;
  attendanceStatus?: string | null;
}

export interface Table {
  id: string;
  uuid?: string;
  name: string;
  number: number;
}
