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