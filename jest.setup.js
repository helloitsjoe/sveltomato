// Mock out subset of SpeechRecognition in order to call
// annyang.trigger to trigger speech. Not the greatest but
// convenient to test and should indicate if annyang breaks
window.SpeechRecognition = class MockSpeech {
  start() {
    this.onstart();
  }
};
