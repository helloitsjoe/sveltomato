<script>
  import Pomodoro from './Pomodoro.svelte';
  import { createSpeechApi } from './speech';
  import { formatTime, timers } from './utils';

  export let audio = new Audio('audio/weird-scream.wav');
  export let seconds = new URLSearchParams(window.location.search).get(
    'seconds'
  );

  let interval;
  let running = false;
  let currentTimer = timers.pomodoro;
  let timeLeft = seconds ? seconds * 1000 : currentTimer.time;

  // custom timers
  // save timers

  let tomatoText = 'Lavora!';
  let userSaid = '';

  $: getActive = timer => (timer === currentTimer ? 'active' : '');
  $: document.title = `${formatTime(timeLeft)} - Sveltomato`;

  const playSound = () => {
    audio.play();
  };

  const handlePlayPause = () => {
    return running ? pause() : play();
  };

  const play = () => {
    running = true;
    interval = setInterval(() => {
      timeLeft -= 1000;
      if (timeLeft <= 0) {
        timeLeft = 0;
        clearInterval(interval);
        tomatoText = 'Festa!';
        playSound();
        // Make some noise
      }
    }, 1000);
  };

  const pause = () => {
    running = false;
    clearInterval(interval);
  };

  const reset = () => {
    clearInterval(interval);
    timeLeft = currentTimer.time;
    pause();
  };

  const startNewTimer = type => {
    clearInterval(interval);
    timeLeft = type.time;
    tomatoText = type.text;
    currentTimer = type;
    play();
  };

  const resultMatch = result => (userSaid = result);
  const resultNoMatch = () => (userSaid = 'Unknown...');

  export let speech = createSpeechApi({
    play,
    pause,
    reset,
    startNewTimer,
    resultMatch,
    resultNoMatch,
  });
</script>

<main>
  <div>
    <Pomodoro text={tomatoText} {timeLeft} on:click={handlePlayPause} />
  </div>
  <div class="panel">
    <div class="controls">
      <!-- TODO: Make this a radio group -->
      <button
        class={getActive(timers.pomodoro)}
        on:click={() => startNewTimer(timers.pomodoro)}>Pomodoro</button
      >
      <button
        class={getActive(timers.short)}
        on:click={() => startNewTimer(timers.short)}>Festa corta</button
      >
      <button
        class={getActive(timers.long)}
        on:click={() => startNewTimer(timers.long)}>Festa lunga</button
      >
    </div>
    <button class="text" on:click={reset}>Reset</button>
  </div>
  {#if !speech}
    <div class="speech">Speech recognition not supported on this device</div>
  {:else if userSaid}
    <div class="speech">You said "{userSaid}"</div>
  {:else}
    <div class="speech">
      Waiting for a command - try "start timer" or "stop timer"
    </div>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  button.text {
    background: none;
    border: none;
    padding: 1em;
    color: limegreen;
    font-weight: bold;
    text-transform: uppercase;
    margin: 1em auto;
  }

  button.text:focus {
    outline: none;
    box-shadow: 0px 0px 0px 2px cornflowerblue;
  }

  @media screen and (max-width: 550px) {
    .controls {
      flex-direction: column;
    }
  }

  .panel {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 600px;
    text-align: center;
  }

  .controls {
    display: flex;
    justify-content: space-around;
  }

  .controls button {
    flex: 1;
    font-weight: bold;
    border: 2px solid limegreen;
    border-radius: 0;
    background-color: limegreen;
    color: white;
    text-transform: uppercase;
    padding: 1em;
  }

  .controls button:focus {
    outline: 2px solid cornflowerblue;
  }

  .controls button.active {
    background-color: white;
    color: limegreen;
  }

  .speech {
    font-weight: bold;
    text-transform: uppercase;
    color: tomato;
  }
</style>
