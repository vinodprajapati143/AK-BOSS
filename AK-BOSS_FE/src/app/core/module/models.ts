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
  closeCountdown: number;
  openCountdown: number;
  id: number;
  game_name: string;
  open_time: string;
  close_time: string;
}