import { render, screen, fireEvent } from '@testing-library/svelte';
import App from '../App';

const { queryByRole, queryByText, queryByTestId } = screen;

const speech = {};

describe('App', () => {
  it('pomodoro button shows 25 minutes', async () => {
    render(App, { speech });

    // Shows 'Lavora' text by default
    const tomatoButton = queryByTestId('tomato-button');
    expect(tomatoButton.textContent).toMatch(/get to work/i);
    expect(tomatoButton.textContent).not.toMatch(/relax/i);

    expect(queryByRole('button', { name: /reset/i })).toBeTruthy();

    expect(queryByText(/25:00/)).toBeTruthy();

    await fireEvent.click(queryByText(/pomodoro/i));
    expect(tomatoButton.textContent).toMatch(/25:00/);
  });

  it('short break button shows 5 minutes', async () => {
    render(App, { speech });

    const tomatoButton = queryByTestId('tomato-button');

    await fireEvent.click(queryByText(/short/i));
    expect(tomatoButton.textContent).toMatch(/relax/i);
    expect(tomatoButton.textContent).toMatch(/5:00/);
  });

  it('long break button shows 15 minutes', async () => {
    render(App, { speech });

    const tomatoButton = queryByTestId('tomato-button');

    await fireEvent.click(queryByText(/long/i));
    expect(tomatoButton.textContent).toMatch(/seriously. relax/i);
    expect(tomatoButton.textContent).toMatch(/15:00/);
  });

  it('enableSpeech: true enables speech', () => {
    render(App, { speech, enableSpeech: true });
    expect(screen.queryByText(/waiting for a command/i)).toBeTruthy();
  });

  it('enableSpeech: false diables speech', () => {
    render(App, { speech, enableSpeech: false });
    expect(screen.queryByText(/waiting for a command/i)).toBeNull();
  });
});

describe('timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('pomodoro timer shows 20:00 when 5 minutes have passed', async () => {
    const audio = { play: jest.fn() };

    render(App, { audio, speech });

    const tomatoBtn = queryByTestId('tomato-button');
    const fiveMinutesInMs = 5 * 60 * 1000;

    expect(tomatoBtn.textContent).toMatch(/25:00/);

    await fireEvent.click(tomatoBtn);
    await jest.advanceTimersByTime(fiveMinutesInMs);
    expect(tomatoBtn.textContent).toMatch(/20:00/);
  });

  it('plays audio when timer reaches 0:00', async () => {
    const audio = { play: jest.fn() };

    render(App, { audio, speech });

    const tomatoBtn = queryByTestId('tomato-button');
    const twentyFiveMinutesInMs = 25 * 60 * 1000;

    expect(tomatoBtn.textContent).toMatch(/25:00/);

    await fireEvent.click(tomatoBtn);

    expect(audio.play).not.toHaveBeenCalled();

    await jest.advanceTimersByTime(twentyFiveMinutesInMs);
    expect(tomatoBtn.textContent).toMatch(/party! 0:00/i);

    // A sound should be played once the timer has finished.
    expect(audio.play).toHaveBeenCalled();
  });
});
