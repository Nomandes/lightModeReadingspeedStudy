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
import jsPsychSurvey from "@jspsych/plugin-survey";
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
      // Save data to file
      const data = jsPsych.data.get();
      const timestamp = Date.now();
      const dataJson = data.json();
      
      // Create a blob and download it as JSON
      const blob = new Blob([dataJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `results_${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Also save as CSV for easier analysis
      const dataCsv = data.csv();
      const blobCsv = new Blob([dataCsv], { type: 'text/csv' });
      const urlCsv = URL.createObjectURL(blobCsv);
      const linkCsv = document.createElement('a');
      linkCsv.href = urlCsv;
      linkCsv.download = `results_${timestamp}.csv`;
      document.body.appendChild(linkCsv);
      linkCsv.click();
      document.body.removeChild(linkCsv);
      URL.revokeObjectURL(urlCsv);
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
  // timeline.push({
  //   type: HtmlKeyboardResponsePlugin,
  //   stimulus: "<p>Welcome to DarkOrLight! Press any Key to Continue<p/>",
  //   choices: ["Enter"],
  // });

  // Switch to fullscreen
  // timeline.push({
  //   type: FullscreenPlugin,
  //   fullscreen_mode: true,
  // });
  //
  // timeline.push({
  //     type: HtmlKeyboardResponsePlugin,
  //     stimulus: `
  //   <p>In this experiment, you will read different texts in different background
  //   and text colors</p><p>We will start with a trial round where you can get
  //   familiar with the environment, after that there will follow two tasks.
  //   After every reading you will have a short break</p><p>Please start reading
  //   as soon as the text is visible and end the trial when finished by hitting
  //   Enter on the keyboard</p>
  //   <p>Press Enter to begin.</p>
  // `,
  //   choices: ["Enter"],
  //   post_trial_gap: 2000
  // });

  timeline.push({
    type: jsPsychSurvey,
    title: 'Introduction Questions',
    survey_json: {
      elements:
          [
            {
              type: 'text',
              title: "Participant ID",
              description: "We want to anonymize your data, so please fill"
                  + " out this field as follows: Combine the 3 Characters"
                  + " of your Fathers first name with the 3 Characters from"
                  + " your Mothers first name and the day of your birhtday."
                  + " Example: Father: Mustafa, Mother: Gina, Birthday:"
                  + " 15.09.2000 - ID: MUSGIN15",
              name: 'participant-id',
              placeholder: "Participant ID",
              isRequired: true,
            },
            {
              type: 'radiogroup',
              title: "What is your Gender?",
              name: 'gender',
              choices: ['Female', 'Male', 'Non-Binary', 'Prefer not to say', 'Other']
            },
            {
              type: 'radiogroup',
              title: "How Old are you?",
              name: 'age',
              choices: ['18 to 24', '25 to 34', '35 to 44', '45 to 54', '55'
              + ' to 64','65 or over']
            },
            {
              type: 'radiogroup',
              title: "What is your English Level?",
              name: 'englishLevel',
              choices: ['B1 - Intermediate', 'B2 - Upper Intermediate', 'C1 -'
              + ' Advanced', 'C2 - Native']
            }
          ]
    }
  });
  const trial_break = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
    <h3>Break</h3>
    <h4>You have 30 seconds to rest! We will anounce when to hit enter to move on</h4>`,
    choices: ["Enter"]
  };

  const practice_content = [
    {
      stimulus: `<div class="text-box"><p class="trial-text">${text_practice1}<p/></div>`,
      mode: "light-mode"
    },
    {
      stimulus: `<div class="text-box"><p class="trial-text">${text_practice2}<p/></div>`,
      mode: "dark-mode"
    },
  ];

  const practice = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: [jsPsych.timelineVariable('stimulus')],
    data: { is_practice: true},
    choices: ["Enter"],
    css_classes: [jsPsych.timelineVariable('mode')],
    randomize_order: true
  };

  // const comprehension_question = {
  //   type: jsPsychSurvey,
  //   title: 'Comprehension Questions',
  //   survey_json: {
  //     elements:
  //         [
  //           {
  //             type: 'radiogroup',
  //             title: "What did the towns name stood for?",
  //             name: 'comprehension 1',
  //             choices: ['18 to 24', '25 to 34', '35 to 4', '45 to 54', '55'
  //             + ' to 64','65 or over']
  //           },
  //         ]
  //   }
  // };
  timeline.push({
    timeline: [practice],
    timeline_variables: practice_content
  });

  timeline.push(trial_break);

  const trial_content = [
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial1}<p/></div>`, mode: "light-mode"},
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial2}<p/></div>`, mode: "dark-mode"},
  ];
  const trial_content2 = [
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial2}<p/></div>`, mode: "dark-mode"},
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial1}<p/></div>`, mode: "light-mode"}
  ];
  const trial_content3 = [
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial1}<p/></div>`, mode: "light-mode"},
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial2}<p/></div>`, mode: "dark-mode"},
  ];
  const trial_content4 = [
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial2}<p/></div>`, mode: "dark-mode"},
    { stimulus: `<div class="text-box"><p class="trial-text">${text_trial1}<p/></div>`, mode: "light-mode"}
  ];


  const trial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: [jsPsych.timelineVariable('stimulus')],
    css_classes: [jsPsych.timelineVariable('mode')],
    choices: ["Enter"],
    randomize_order: true
  };

  timeline.push({
    timeline: [trial],
    timeline_variables: [trial_content[0]]
  });

  timeline.push(trial_break);

  timeline.push({
    timeline: [trial],
    timeline_variables: [trial_content[1]]
  });

  timeline.push({
    type: jsPsychSurvey,
    title: 'Outro Questions',
    survey_json: {
      elements:
          [
            {
              "type": "rating",
              "name": "reading-experience",
              "title": "How often do you read books ?",
              "rateValues": [ 1, 2, 3, 4, 5],
              "minRateDescription": "Never",
              "maxRateDescription": "Daily"
            }
          ]
    }
  });

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
