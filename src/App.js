import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import './App.module.css';
import styles from './App.module.css';



const firebaseConfig = {
  apiKey: "AIzaSyAsFdzyu8mylZzjdapf7XjsrVj5PneB14A",
  authDomain: "prompteditorlck.firebaseapp.com",
  projectId: "prompteditorlck",
  storageBucket: "prompteditorlck.appspot.com",
  messagingSenderId: "698714221455",
  appId: "1:698714221455:web:78a5097e8da816a4be79fa",
  measurementId: "G-SVR8HD5VBB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [prompt, setPrompt] = useState('');
  const [parametersSettingsOpen, setParametersSettingsOpen] = useState(false);
  const [aspectRatioSettingsOpen, setAspectRatioSettingsOpen] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [promptHistoryOpen, setPromptHistoryOpen] = useState(false);


  useEffect(() => {
    const loadPromptHistory = async () => {
      try {
        const snapshot = await db
          .collection('prompts')
          .orderBy('timestamp', 'desc')
          .limit(10)
          .get();
        const prompts = snapshot.docs.map((doc) => doc.data().prompt);
        setPromptHistory(prompts);
      } catch (error) {
        console.log('Error loading prompt history:', error);
      }
    };

    loadPromptHistory();
  }, []);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleParametersClick = () => {
    setParametersSettingsOpen((prevState) => !prevState);
  };

  const handleAspectRatioClick = () => {
    setAspectRatioSettingsOpen((prevState) => !prevState);
  };

  const handleParametersSettingClick = (setting) => {
    setPrompt((prevPrompt) => `${prevPrompt} ${setting.name}`);
  };

  const handleAspectRatioSettingClick = (setting) => {
    setPrompt((prevPrompt) => `${prevPrompt} ${setting.name}`);
  };

  const handleHistoryClick = () => {
    setHistoryOpen((prevState) => !prevState);
  };

  const handlePromptHistoryClick = (selectedPrompt) => {
    setPrompt(selectedPrompt);
  };

  const parametersSettings = [
    {
      name: '--no <object>',
      description: 'Excludes something. For example, "--no house" will try to draw a picture without houses.',
      action: 'Adds -no {object} to the prompt, where {object} is the thing to be excluded.',
    },
    {
      name: '--hd',
      description: 'Uses a different algorithm that is best suited for abstract and landscape queries. It also generates images with higher resolution without the need for scaling.',
      action: 'Adds -hd to the prompt.',
    },
    {
      name: '--video',
      description: 'Saves a video of the generation progress. To save the video, you need to react with an envelope ✉ to the message to get a link to the video in a personal conversation with the bot.',
      action: 'Adds -video to the prompt.',
    },
    {
      name: '--uplight',
      description: 'Uses "light upscale" when choosing U buttons. The results become closer to the original image with fewer details added during scaling. It is perfect for faces and smooth surfaces.',
      action: 'Adds -uplight to the prompt.',
    },
    {
      name: '::<number>',
      description: 'You can add a suffix from -1 to 2 to any hint (without spaces) to assign this part of the weight, that is, the importance of one or another hint before others. By default, it is equal to 1. And the value of -0.5 is equal to the --no command.',
      action: 'Adds ::{number} to the hint in the prompt, where {number} is the weight of the hint.',
    },
    {
      name: '--iw <number>',
      description: 'Adds one or more image URLs before the main text, and it will use these images as visual inspiration. The --iw <number> parameter sets the weight of the image hint relative to the weight of the text. The default value is --iw 0.25.',
      action: 'Adds -iw {number} to the prompt, where {number} is the weight of the image hint.',
    },
    {
      name: '--q <number>',
      description: 'The "quality" of the image in terms of generation. The range is from 0.25 to 5. The base value is at 1, and at 5 it will work through each picture for 5 minutes.',
      action: 'Adds -q {number} to the prompt, where {number} is the weight of the image hint.',
    },
    {
      name: '--chaos <number>',
      description: 'How much more diverse and random your results will be. The range of values is from 0 to 100. Higher values will contribute to more interesting and unusual generations in exchange for more isolated compositions. Using a low value or not specifying a value will create initial image grids that change slightly each time the task is started. If you use a higher value, the original image grids will be more diverse and unexpected each time you start the task. When using extremely high values, the original image grids will differ from each other and have unexpected compositions or artistic environments every time you start the task.',
      action: 'Adds -chaos {number} to the prompt, where {number} is the weight of the image hint.',
    },
    {
      name: '--seed',
      description: 'Sets an initial value that can help maintain stability and reproducibility when trying to create something like this again. This should be a number between 0 and 4294967295. If it is not used, a random starting number will be selected instead. You can respond with an envelope ✉ to the task message to find out what initial value was used.',
      action: 'Adds -seed to the prompt.',
    },
    {
      name: '--sameseed',
      description: 'Makes sure that the initial number equally affects all images of the resulting grid. If it is not used, each image in the grid will use different "sids", providing greater diversity.',
      action: 'Adds -sameseed to the prompt.',
    },
    {
      name: '--s <number>',
      description: 'The stylization argument establishes how strong the stylization of your images is, the higher you install it, the more stylized it will be. The default value is 2500. Approximate range from 625 to 20000.',
      action: 'Adds -s {number} to the prompt, where {number} is the weight of the image hint.',
    },
    {
      name: '--stop <number>',
      description: 'Stop generation earlier. Values from 10 to 100.',
      action: 'Adds -stop to the prompt.',
    },
  ];

  const aspectRatioSettings = [
    {
      name: '--ar 16:9',
      description: 'Today’s standard ratio for film and display.',
    },
    {
      name: '--ar 9:16',
      description: 'Used for mobile first images, such as Instagram stories or Snapchat.',
    },
    {
      name: '--ar 10:16',
      description: 'Midjourney community favorite for portraits.',
    },
    {
      name: '--ar 4:3',
      description: 'Used to be the aspect ratio of 35mm celluloid film, TVs, and monitors.',
    },
    {
      name: '--ar 4:5',
      description: 'Instagram portrait.',
    },
    {
      name: '--ar 2:1',
      description: 'The Univisium ratio. Introduced by Vittorio Storaro in the 90s as a compromise between cinema screens and TV screens. Now famous in video streaming.',
    },
  ];

  const handleSavePrompt = async () => {
    if (prompt.trim() === '') {
      console.log('Prompt is empty. Not saving.');
      return;
    }
  
    try {
      await db.collection('prompts').add({
        prompt,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setPrompt('');
      console.log('Prompt saved successfully!');
    } catch (error) {
      console.log('Error saving prompt:', error);
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Prompt:</h2>
      <div className={styles.promptContainer}>
        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your prompt"
        />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleParametersClick}>Parameters</button>
        {parametersSettingsOpen && (
          <div className={styles.settingsContainer}>
            {parametersSettings.map((setting, index) => (
              <div key={index} className={styles.setting}>
                <button className={styles.settingButton} onClick={() => handleParametersSettingClick(setting)}>
                  {setting.name}
                </button>
                <span className={styles.settingDescription}>{setting.description}</span>
              </div>
            ))}
          </div>
        )}
        <button className={styles.button} onClick={handleAspectRatioClick}>Aspect ratio</button>
        {aspectRatioSettingsOpen && (
          <div className={styles.settingsContainer}>
            {aspectRatioSettings.map((setting, index) => (
              <div key={index} className={styles.setting}>
                <button className={styles.settingButton} onClick={() => handleAspectRatioSettingClick(setting)}>
                  {setting.name}
                </button>
                <span className={styles.settingDescription}>{setting.description}</span>
              </div>
            ))}
          </div>
        )}
        <button className={styles.button} onClick={handleSavePrompt}>Save prompt</button>
        <button className={styles.button} onClick={() => setPromptHistoryOpen(!promptHistoryOpen)}>History</button>
        {promptHistoryOpen && (
          <div className={styles.history}>
            <h3 className={styles.subtitle}>Prompt History:</h3>
            <ul className={styles.list}>
              {promptHistory.map((promptItem, index) => (
                <li key={index} className={styles.listItem} onClick={() => handlePromptHistoryClick(promptItem)}>
                  {promptItem.split(' ').slice(0, 3).join(' ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
              }  
                export default App;
