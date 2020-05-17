import { idioms } from './idioms.js';

const idiom = document.querySelector('#idiom');
const meaning = document.querySelector('#meaning');
const buttons = document.querySelector('footer');

const ok = document.querySelector('button.ok');
const no = document.querySelector('button.no');
const meh = document.querySelector('button.meh');

let list;
let counter = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
    ok.addEventListener('click', (e) => register(1));
    no.addEventListener('click', (e) => register(-1));
    meh.addEventListener('click', (e) => register(0));

    idiom.addEventListener('click', (e) => {
        meaning.style.height = '67%';
        meaning.style.display = 'flex';
        meaning.style.color = 'white';
        idiom.style.height = '33%';
        buttons.style.display = 'block';
    });

    list = Object.keys(idioms);
    
    const len = list.length;
    for (let i = 0; i < len; i++) {
        const o = parseInt(Math.random() * len);
        [list[i], list[o]] = [list[o], list[i]];
    }

    nextIdiom();
}

function nextIdiom() {
    idiom.textContent = list[counter];
    meaning.textContent = idioms[list[counter]];
    counter++;
}

function setup() {
    buttons.style.display = 'none';
    meaning.style.height = '0';
    meaning.style.display = 'none';
    idiom.style.height = '100%';
}

function register(v) {
    setup();
    // registrar a pontuação
    nextIdiom();
}
