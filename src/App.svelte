<script>
  import Pomodoro from './Pomodoro.svelte';
  import { createSpeechApi } from './speech';
  import { formatTime, timers } from './utils';

  const params = new URLSearchParams(window.location.search);

  export let audio = new Audio('audio/weird-scream.wav');
  export let enableSpeech = params.get('speech');
  export let seconds = params.get('seconds');

  let interval;
  let running = false;
  let currentTimer = timers.pomodoro;
  let timeLeft = seconds ? seconds * 1000 : currentTimer.time;

  // custom timers
  // save timers

  let tomatoText = 'Get to work!';
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
        tomatoText = 'Party!';
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

  export let speech = enableSpeech
    ? createSpeechApi({
        play,
        pause,
        reset,
        startNewTimer,
        resultMatch,
        resultNoMatch,
      })
    : null;

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
        on:click={() => startNewTimer(timers.short)}>Short break</button
      >
      <button
        class={getActive(timers.long)}
        on:click={() => startNewTimer(timers.long)}>Long break</button
      >
    </div>
    <button class="text" on:click={reset}>Reset</button>
  </div>
  {#if enableSpeech}
    {#if !speech}
      <div class="speech">Speech recognition not supported on this device</div>
    {:else if userSaid}
      <div class="speech">You said "{userSaid}"</div>
    {:else}
      <div class="speech">
        Waiting for a command - try "start timer" or "stop timer"
      </div>
    {/if}
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
