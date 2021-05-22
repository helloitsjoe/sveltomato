import annyang from 'annyang';
import { timers } from './utils';

const noop = name => () => console.log(`No handler for ${name}`);

export const createSpeechApi = ({
  play,
  pause,
  reset,
  startNewTimer,
  resultMatch = noop('resultMatch'),
  resultNoMatch = noop('resultNoMatch'),
  api = annyang,
}) => {
  if (!api) {
    // SpeechRecognition API not supported
    return null;
  }

  const commands = {
    'play (timer)': play,
    'start (timer)': play,
    'pause (timer)': pause,
    'stop (timer)': pause,
    'reset (timer)': reset,
    '(start) work': () => startNewTimer(timers.pomodoro),
    '(start) :length (break)': () => startNewTimer(timers[length]),
  };

  api.addCommands(commands);
  api.debug();
  api.start();
  api.addCallback('resultMatch', resultMatch);
  api.addCallback('resultNoMatch', resultNoMatch);

  return api;
};

// export const createSpeechApi = () => {
//   const SpeechRecognition =
//     window.SpeechRecognition ||
//     window.webkitSpeechRecognition ||
//     window.mozSpeechRecognition ||
//     window.msSpeechRecognition ||
//     window.oSpeechRecognition;

//   const SpeechGrammarList =
//     window.SpeechGrammarList ||
//     window.webkitSpeechGrammarList ||
//     window.mozSpeechGrammarList ||
//     window.msSpeechGrammarList ||
//     window.oSpeechGrammarList;

//   if (!(SpeechRecognition && SpeechGrammarList)) {
//     console.warn('Speech recognition not supported');
//     return {};
//   }

//   const defaultGrammars = [
//     '#JSGF V1.0; grammar triggers; public <trigger> = computer;',
//     '#JSGF V1.0; grammar colors; public <color> = red | blue | green | tomato | lime;',
//     '#JSGF V1.0; grammar commands; public <command> = start | stop | pause | work | short | long;',
//   ];

//   const recognition = new SpeechRecognition();
//   const grammars = new SpeechGrammarList();
//   for (const g of defaultGrammars) {
//     // Weight is 1
//     grammars.addFromString(g, 1);
//   }
//   recognition.grammars = grammars;

//   recognition.start();

//   recognition.onresult = e => {
//     console.log(`e:`, e);
//     const result = e.results[e.resultIndex][0].transcript;
//   };
// };
