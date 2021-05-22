export const formatTime = ms => {
  const min = Math.floor((ms / 1000 / 60) % 60).toString();
  const sec = Math.floor((ms / 1000) % 60).toString();
  return `${min}:${sec.padStart(2, '0')}`;
};

const MINUTES_IN_MS = 60 * 1000;

export const timers = {
  pomodoro: {
    time: 25 * MINUTES_IN_MS,
    text: 'Lavora!',
  },
  short: {
    time: 5 * MINUTES_IN_MS,
    text: 'Relax.',
  },
  long: {
    time: 15 * MINUTES_IN_MS,
    text: 'Dai. Relax.',
  },
  test: {
    time: 3000,
    text: 'Testing',
  },
};
