import sentences from './sentences.js';

const input = document.querySelector('p.input');
const output = document.querySelector('p.output');

document.addEventListener('DOMContentLoaded', e => {
  input.textContent = sentences[0];
});

const bt = document.querySelector('button#record');

let p = 1;
document.querySelector('button#next').addEventListener('click', e => {
  input.textContent = sentences[p++] || 'There are no more sentences.';
});

const pressing = (e) => {
  bt.classList.add('pressing');
  recognition.start();
};

const releasing = (e) => {
  bt.classList.remove('pressing');
  recognition.stop();
};

bt.addEventListener('mousedown', pressing);
bt.addEventListener('touchstart', pressing);

document.addEventListener('mouseup', releasing);
document.addEventListener('touchend', releasing);

const recognition = new webkitSpeechRecognition();
recognition.lang = 'en-GB';
// recognition.continuous = false;
// recognition.interimResults = true;
recognition.onresult = function (e) {
  console.log(e);
  if (e.returnValue) {
    if (e.results[0] && e.results[0].isFinal) {
      output.textContent = e.results[0][0].transcript;
      //  + ` (${Math.floor(e.results[0][0].confidence * 100)}%)`;
    }
  }
}

input.addEventListener('click', e => {
  const utter = new SpeechSynthesisUtterance(input.textContent);
  utter.rate = 0.5;
  utter.voice = speechSynthesis.getVoices().find(v => v.lang === 'en-GB');
  speechSynthesis.speak(utter);
});
