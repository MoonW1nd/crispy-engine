import { Request, Response } from 'express';

exports.status = (req: Request, res: Response) => {
  let time: string | number = process.uptime();

  const secondAmount: number = parseInt(String(time), 10);

  let hours = Math.floor(secondAmount / 3600);
  let minutes = Math.floor((secondAmount - (hours * 3600)) / 60);
  let seconds = secondAmount - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = Number(`0${hours}`); }
  if (minutes < 10) { minutes = Number(`0${minutes}`); }
  if (seconds < 10) { seconds = Number(`0${seconds}`); }
  time = `${hours}:${minutes}:${seconds}`;

  res.send(`time: ${time}`);
};
