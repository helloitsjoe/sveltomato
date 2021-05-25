import annyang from 'annyang';
import { createSpeechApi } from '../speech';
import { timers } from '../utils';

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
};

const callbacks = {
  resultMatch: jest.fn(),
  resultNoMatch: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('speech', () => {
  it('returns null if no api', () => {
    const speech = createSpeechApi({ ...handlers, ...callbacks, api: null });
    expect(speech).toBeNull();
  });

  it('maps result handlers to commands', () => {
    const speech = createSpeechApi({ ...handlers, ...callbacks, api });

    const { resultMatch, resultNoMatch } = callbacks;
    expect(api.addCallback).toBeCalledWith('resultMatch', resultMatch);
    expect(api.addCallback).toBeCalledWith('resultNoMatch', resultNoMatch);
  });

  describe('commands', () => {
    const speech = createSpeechApi({ ...handlers, ...callbacks, api: annyang });

    it.each`
      sentence                  | handler
      ${'play timer'}           | ${'play'}
      ${'start timer'}          | ${'play'}
      ${'play the timer'}       | ${'play'}
      ${'start the timer'}      | ${'play'}
      ${'stop timer'}           | ${'pause'}
      ${'pause timer'}          | ${'pause'}
      ${'stop the timer'}       | ${'pause'}
      ${'pause the timer'}      | ${'pause'}
      ${'reset timer'}          | ${'reset'}
      ${'reset the timer'}      | ${'reset'}
      ${'start the work timer'} | ${'startNewTimer'}
    `('"$sentence" triggers $handler', ({ sentence, handler }) => {
      // Silence log
      const originalLog = console.log;
      console.log = () => {};
      // Use real annyang to test speech
      speech.trigger(sentence);

      expect(handlers[handler]).toBeCalled();
      Object.keys(handlers)
        .filter(key => key !== handler)
        .forEach(key => {
          expect(handlers[key]).not.toBeCalled();
        });
      console.log = originalLog;
    });

    it.each`
      sentence                  | handler            | timerName
      ${'start the work timer'} | ${'startNewTimer'} | ${'pomodoro'}
      ${'start a work timer'}   | ${'startNewTimer'} | ${'pomodoro'}
      ${'work timer'}           | ${'startNewTimer'} | ${'pomodoro'}
      ${'start work'}           | ${'startNewTimer'} | ${'pomodoro'}
      ${'work'}                 | ${'startNewTimer'} | ${'pomodoro'}
      ${'start a short break'}  | ${'startNewTimer'} | ${'short'}
      ${'take a short break'}   | ${'startNewTimer'} | ${'short'}
      ${'short'}                | ${'startNewTimer'} | ${'short'}
      ${'take a long break'}    | ${'startNewTimer'} | ${'long'}
      ${'start long break'}     | ${'startNewTimer'} | ${'long'}
      ${'long'}                 | ${'startNewTimer'} | ${'long'}
    `(
      '"$sentence" triggers $handler with timers.$timerName',
      ({ sentence, handler, timerName }) => {
        // Silence log
        const originalLog = console.log;
        console.log = () => {};
        // Use real annyang to test speech
        speech.trigger(sentence);

        expect(handlers[handler]).toBeCalledWith(timers[timerName]);
        Object.keys(handlers)
          .filter(key => key !== handler)
          .forEach(key => {
            expect(handlers[key]).not.toBeCalled();
          });
        console.log = originalLog;
      }
    );
  });
});
