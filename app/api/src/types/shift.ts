export type shiftInput = {
  carerID: string;
  clientID: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string | null;
};

export type Shift = {
  carerID: number;
  clientID: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: number;
  notes: string | null;
};
