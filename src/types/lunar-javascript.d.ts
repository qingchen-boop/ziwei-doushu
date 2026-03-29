declare module 'lunar-javascript' {
  export class Solar {
    constructor(year: number, month: number, day: number, hour?: number, minute?: number);
    getDate(): Date;
    getLunar(): Lunar;
  }

  export class Lunar {
    constructor();
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getShengXiao(): string;
  }
}