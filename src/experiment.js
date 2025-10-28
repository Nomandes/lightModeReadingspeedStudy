/**
 * @title DarkOrLight
 * @description Comparing Readingspeed in Dark or Light Mode
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";
import {text_trial1, text_trial2, text_practice1, text_practice2} from "./texts";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych({
    on_finish: function() {
      jsPsych.data.displayData();
    }
  });

  const timeline = [];

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  // Welcome screen
  /*timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: "<p>Welcome to DarkOrLight! Press any Key to Continue<p/>",
    choices: ["Enter"],
  });*/

  // Switch to fullscreen
  /*timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });*/

  /*timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
    <p>In this experiment, you will read different texts in different background 
    and text colors</p><p>We will start with a trial round where you can get 
    familiar with the environment, after that there will follow two tasks. 
    After every reading you will have a short break</p><p>Please start reading 
    as soon as the text is visible and end the trial when finished by hitting 
    Enter on the keyboard</p>
    <p>Press Enter to begin.</p>
  `,
    choices: ["Enter"],
    post_trial_gap: 2000
  });*/

  const trial_break = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
    <h3>Break</h3>
    <h4>The next Task will follow in 1 Minute!</h4>
  `,
    choices: ["Enter"],
    post_trial_gap: 2000
  };

  const practice_content = [
    { stimulus: `<div class="text-box"><p class="trial-text">${text_practice1}<p/></div>`, mode: "light-mode"},
    { stimulus: `<div class="text-box"><p class="trial-text">${text_practice2}<p/></div>`, mode: "dark-mode"},
  ];

  const practice = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: [jsPsych.timelineVariable('stimulus')],
    data: { is_practice: true},
    choices: ["Enter"],
    css_classes: [jsPsych.timelineVariable('mode')],
    randomize_order: true
  };

  /*timeline.push({
    timeline: [practice, trial_break],
    timeline_variables: practice_content
  });*/

  const trial_content = [
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial1}<p/></div>`, mode: "light-mode"},
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial1}<p/></div>`, mode: "dark-mode"},
  ];

  const trial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: [jsPsych.timelineVariable('stimulus')],
    css_classes: [jsPsych.timelineVariable('mode')],
    choices: ["Enter"],
    randomize_order: true
  };

  timeline.push({
    timeline: [trial,trial_break],
    timeline_variables: trial_content
  });

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
