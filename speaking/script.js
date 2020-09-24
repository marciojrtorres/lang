import Levenshtein from './levenshtein.js';

const divGrade = document.querySelector('div#grade');
const textarea = document.querySelector('textarea');
const input = document.querySelector('p.input');
const output = document.querySelector('p.output');
let spans;

const bt = document.querySelector('button#record');

function spanify(sentence) {
  return sentence.replace(/(\w+)/g, '<span>$&</span>');
}

const pressing = (e) => {
  input.innerHTML = spanify(input.textContent);
  spans = input.querySelectorAll('span');
  divGrade.style.display = 'none';
  // spans.forEach(span => {
  //   span.classList.remove('good', 'reasonable', 'weak');
  // });
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
// recognition.lang = 'en-GB';
// recognition.continuous = false;
// recognition.interimResults = true;
recognition.onstart = function(e) {
  output.textContent = 'You can read the phrase out loud.';
}

recognition.onerror = function (e) {
  console.log(e);
  output.textContent = 'Try again.';
}

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
  textarea.style.display = 'block';
  input.style.display = 'none';
  textarea.value = input.textContent;
  textarea.select();
  textarea.focus();
  e.stopPropagation();
});

document.body.addEventListener('click', e => {
  if (e.target === textarea || e.target === bt) return;
  input.innerHTML = textarea.value;
  input.style.display = 'block';
  textarea.style.display = 'none';
}, false);

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
