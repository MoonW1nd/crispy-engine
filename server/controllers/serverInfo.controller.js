exports.status = (req, res) => {
  let time = process.uptime();

  const secondAmount = parseInt(time, 10);

  let hours = Math.floor(secondAmount / 3600);
  let minutes = Math.floor((secondAmount - (hours * 3600)) / 60);
  let seconds = secondAmount - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }

  time = `${hours}:${minutes}:${seconds}`;

  res.send(`time: ${time}`);
};
