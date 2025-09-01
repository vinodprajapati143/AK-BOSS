export class CustomError implements Error {
  name: string;
  message: string;
  code: number;
  data: any;
  constructor(message: string, statusCode: number, data: any) {
    this.message = message;
    this.name = "CustomError";
    this.code = statusCode;
    this.data = data;
  }
}

export interface Game {
  status: string;
patte2: any;
patte2_close: any;
patte1_open: any;
patte1: any;
  closeTimerStarted: boolean;
  closeTime: number;
  closeWindowStart: number;
  closeInputEnabled: boolean;
  openInputEnabled: boolean;
  openTimerStarted: boolean;
  openTime: number;
  openWindowStart: number;
  submitted: any;
  closeCountdown: number;
  openCountdown: number;
  id: number;
  game_name: string;
  open_time: string;
  close_time: string;
}

export interface gamebyid {
  id?: string;
  game_name: string;
  open_time: string;
  close_time: string;
  days: string[];      // Adjust type as per your needs
  prices: any;         // Adjust type as needed
}

export interface JodiRecord {
  input_date: string;
  jodi_value: string;
}

export interface JodiResponse {
  game_name: string;
  result: string;           // Overall result string, e.g. "568-91-227"
  records: JodiRecord[];    // Array of daily jodi records
}