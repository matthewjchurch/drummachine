class Deck {
    constructor(){
        const instruments = ["cymbal", "hat", "snare", "kick"];
        const beats = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        for (let instrument in instruments){
            for (let beat in beats){
                let current = document.getElementById(`${instruments[instrument]}-wrapper`);
                current.innerHTML += `<button class="beat ${instruments[instrument]} beat${beats[beat]}"></button>`;
            }
        }
        for (let i=0; i<instruments.length; i++){
            let current = document.getElementById(`${instruments[i]}-wrapper`);
            current.innerHTML += `<div class="select-all-container"> <input type="checkbox" class="select-all ${instruments[i]}"></input></div>`;
        }
    }
}

new Deck();

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const pads = document.querySelectorAll('.instrument-wrapper');
const allPadButtons = document.querySelectorAll('.beat');

// switch aria attribute on click
allPadButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('active-beat')) {
        button.classList.remove('active-beat', 'true');
        } else {
        button.classList.add('active-beat', 'false');
        }
    }, false);
});

    // Loading ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // fetch the audio file and decode the data
async function getCymbal(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function getHat(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function getSnare(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function getKick(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

    // create a buffer, plop in data, connect and play -> modify graph here if required
function playSample(audioContext, audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination)
    sampleSource.start();
    return sampleSource;
}

async function setupCymbal() {
    const filePath = './samples/cymbal.wav';
    const sample = await getSnare(audioCtx, filePath);
    return sample;
}

async function setupHat() {
    const filePath = './samples/hat.wav';
    const sample = await getKick(audioCtx, filePath);
    return sample;
}

async function setupSnare() {
    const filePath = './samples/snare.wav';
    const sample = await getSnare(audioCtx, filePath);
    return sample;
}

async function setupKick() {
    const filePath = './samples/kick.wav';
    const sample = await getKick(audioCtx, filePath);
    return sample;
}

    // Scheduling ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bpmControl = document.querySelector('#bpm');

bpmControl.addEventListener('input', ev => {
    tempo = Number(ev.target.value);
}, false);

const lookahead = 10.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0; // The note we are currently playing
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
    const secondsPerBeat = 60.0 / tempo / 4;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === 32) {
        currentNote = 0;
    }
}

    // Create a queue for the notes that are to be played, with the current time that we want them to play:
const notesInQueue = [];

function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({note: beatNumber, time: time});
    if (document.querySelector(`button.cymbal.beat${currentNote}`).classList.contains('active-beat')) {
        playSample(audioCtx, cymbalBuffer);
    }
    if (document.querySelector(`button.hat.beat${currentNote}`).classList.contains('active-beat')) {
        playSample(audioCtx, hatBuffer);
    }
    if (document.querySelector(`button.snare.beat${currentNote}`).classList.contains('active-beat')) {
        playSample(audioCtx, snareBuffer);
    }
    if (document.querySelector(`button.kick.beat${currentNote}`).classList.contains('active-beat')) {
        playSample(audioCtx, kickBuffer);
    }

}

let timerID;
function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

    // We also need a draw function to update the UI, so we can see when the beat progresses.

let lastNoteDrawn = 3;
function draw() {
    let drawNote = lastNoteDrawn;
    const currentTime = audioCtx.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        drawNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (lastNoteDrawn !== drawNote) {
        pads.forEach(pad => {
            pad.children[lastNoteDrawn].classList.remove("highlighted-beat");
            pad.children[drawNote].classList.add("highlighted-beat");
        });

        lastNoteDrawn = drawNote;
    }
    // set up to draw again
    requestAnimationFrame(draw);
}

    // when the sample has loaded allow play
    // const loadingEl = document.querySelector('.loading');
setupCymbal()
.then((sample) => {
    cymbalBuffer = sample; // to be used in our playSample function
});

setupHat()
.then((sample) => {
    hatBuffer = sample; // to be used in our playSample function
});

setupSnare()
.then((sample) => {
    snareBuffer = sample; // to be used in our playSample function
});

setupKick()
.then((sample) => {
    kickBuffer = sample; // to be used in our playSample function
});

const player = document.querySelector('#kick-the-jams');
let isPlaying = false;
player.addEventListener('click', e => {
    isPlaying = !isPlaying;
    player.innerText == "stop the jams" ?
    player.innerText = "kick the jams" :
    player.innerText = "stop the jams";

    if (isPlaying) { // start playing

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        }

        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler(); // kick off scheduling
        requestAnimationFrame(draw); // start the drawing loop.
        e.target.dataset.playing = 'true';
    } else {
        window.clearTimeout(timerID);
        e.target.dataset.playing = 'false';
        allPadButtons.forEach(button => {
            button.classList.remove("highlighted-beat");
        });
    }
});

document.querySelectorAll(".select-all").forEach(selectAllButton => {
    selectAllButton.addEventListener("click", e => {
        let row = document.querySelectorAll(`.${e.target.classList[1]}`);
        if (e.target.checked){
            row.forEach(item => {
                item.classList.add("active-beat");
            })
        } else {
            row.forEach(item => {
                item.classList.remove("active-beat");
            });
        }
    });
});