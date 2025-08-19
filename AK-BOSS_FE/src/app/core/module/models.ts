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