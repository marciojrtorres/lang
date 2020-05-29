import sentences from './sentences.js';
import Levenshtein from './levenshtein.js';

console.log(Levenshtein);

const divGrade = document.querySelector('div#grade');
const input = document.querySelector('p.input');
const output = document.querySelector('p.output');
let spans;

document.addEventListener('DOMContentLoaded', e => {
  // input.textContent = sentences[0];
  next();
});

const bt = document.querySelector('button#record');

let p = 0;
function next(e) {
  const content = sentences[p++] || 'There are no more sentences.';
  input.innerHTML = spanify(content);
  spans = input.querySelectorAll('span');
  divGrade.style.display = 'none';
  spans.forEach(span => {
    span.classList.remove('good', 'reasonable', 'weak');
  })
  // highlightResults('metapor for device imagination retoric');
}

document.querySelector('button#next').addEventListener('click', next);

function spanify(sentence) {
  return sentence.replace(/(\w+)/g, '<span>$&</span>');
}

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
      const result = e.results[0][0].transcript;
      output.textContent = result;
      //  + ` (${Math.floor(e.results[0][0].confidence * 100)}%)`;
      highlightResults(result);
    }
  }
}

input.addEventListener('click', e => {
  const utter = new SpeechSynthesisUtterance(input.textContent);
  utter.rate = 0.5;
  utter.voice = speechSynthesis.getVoices().find(v => v.lang === 'en-GB');
  speechSynthesis.speak(utter);
});

function highlightResults(result) {
  const words = result.split(' ');
  let grade = 0;
  for (let i = 0; i < spans.length; i++) {
    let j = 0;
    for (; j < words.length; j++) {
      const w = spans[i].textContent.trim().toLowerCase()
      const d = Levenshtein.get(w, words[j]);
      if (d === 0) {
        spans[i].classList.add('good');
        grade += 1;
        break;
      } else if (d < (w.length / 4)) {
        spans[i].classList.add('reasonable');
        grade += 0.5;
        break;
      } else if (d < (w.length / 3)) {
        spans[i].classList.add('weak');
        grade += 0.2;
        break;
      }
    }
    words.splice(j, 1);
  }
  const percent = Math.floor(grade / spans.length * 100);
  
  divGrade.textContent = `${percent}%`
  divGrade.style.display = 'flex';
}
