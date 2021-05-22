import { createSpeechApi } from '../speech';

const api = {
  addCommands: jest.fn(),
  debug: jest.fn(),
  start: jest.fn(),
  addCallback: jest.fn(),
};

const handlers = {
  play: jest.fn(),
  pause: jest.fn(),
  reset: jest.fn(),
  startNewTimer: jest.fn(),
  resultMatch: jest.fn(),
  resultNoMatch: jest.fn(),
  api,
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('speech', () => {
  it('returns null if no api', () => {
    const speech = createSpeechApi({ ...handlers, api: null });
    expect(speech).toBeNull();
  });

  it('maps handlers to commands', () => {
    const speech = createSpeechApi(handlers);
    // These functions will give "Serializes to the same string" errors
    // if called with the wrong handlers
    expect(api.addCommands.mock.calls[0][0]).toEqual({
      'play (timer)': handlers.play,
      'start (timer)': handlers.play,
      'pause (timer)': handlers.pause,
      'stop (timer)': handlers.pause,
      'reset (timer)': handlers.reset,
      // '(start) :length (break)': length => handlers.handleTimer(timers[length]),
    });
    expect(api.addCallback).toBeCalledWith('resultMatch', handlers.resultMatch);
    expect(api.addCallback).toBeCalledWith(
      'resultNoMatch',
      handlers.resultNoMatch
    );
  });
});
