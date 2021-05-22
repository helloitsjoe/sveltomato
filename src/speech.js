import annyang from 'annyang';

export const createSpeechApi = commands => {
  if (!annyang) {
    // SpeechRecognition API not supported
    return null;
  }

  annyang.addCommands(commands);
  annyang.debug();
  annyang.start();
  if (commands.resultMatch) {
    annyang.addCallback('resultMatch', commands.resultMatch);
  }
  if (commands.resultNoMatch) {
    annyang.addCallback('resultNoMatch', commands.resultNoMatch);
  }
  return annyang;
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
