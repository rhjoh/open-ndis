export type Shift = {
  shiftID: number;
  carerID: number;
  clientID: number;
  date: string;
  startTime: Date;
  endTime: Date;
  status: string;
  location: number;
  notes: string | null;
};

export type ShiftInsert = Omit<Shift, 'shiftID'>
