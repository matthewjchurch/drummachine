class Deck {
    constructor(){
      const instruments = ["cymbal", "hat", "snare", "kick"];
      const beats = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
      for (let instrument in instruments){
        for (let beat in beats){
            let current = document.getElementById(`${instruments[instrument]}-wrapper`);
            current.innerHTML += `<button class="beat ${instruments[instrument]} beat${beats[beat]}" id="${instruments[instrument]}-beat${beats[beat]}"></button>`;
        }
      }
      for (let i=0; i<instruments.length; i++){
          let current = document.getElementById(`${instruments[i]}-wrapper`);
          current.innerHTML += `<div class="select-all-container"> <input type="checkbox" class="select-all ${instruments[i]}" id="${instruments[i]}-select-all"></input></div>`;
      }
    }
  }


function activeBeatListener () {
    let e = document.getElementsByClassName("beat");
    for (let i=0; i<e.length; i++){
        e[i].addEventListener("click", function(){

        if (this.classList.contains("active-beat")){
            $(this).removeClass("active-beat");
        }
        else { $(this).addClass("active-beat"); }
        });
    }
};

function selectAll(){
    let e = document.getElementsByClassName("select-all");
    for (let i=0; i<e.length; i++){
        e[i].addEventListener("click", function(){
            let row = document.getElementsByClassName(e[i].classList[1]);
            if (e[i].checked){
                $(row).addClass("active-beat");
            }
            else {$(row).removeClass("active-beat")}
        })    
    }
}

new Deck();
activeBeatListener();
selectAll();
document.getElementById("kick-the-jams").addEventListener("click", visualScroll);
document.getElementById("kick-the-jams").addEventListener("click", changeTheJams);

function changeTheJams(){
    var player = document.getElementById("kick-the-jams");
    player.innerHTML == "stop the jams" ?
    player.innerHTML = "kick the jams" :
    player.innerHTML = "stop the jams";
    let bpm = parseInt(document.getElementById("bpm").value, 10);
    
    if (!isNaN(bpm)){
        visualScroll();
    }
    else { 
        alert("please enter a tempo");
        player.innerHTML = "kick the jams";
    };
}

function visualScroll(){
    let bpm = parseInt(document.getElementById("bpm").value, 10);
    let interval = (60000 / bpm) / 4;
    let changer = 0;
                    
    const play = setInterval(function(){
            const previous = document.getElementsByClassName("beat");
            const current = document.getElementsByClassName(`beat${changer}`);
            const state = document.getElementById("kick-the-jams").innerHTML;

        if (state == "kick the jams"){
            clearInterval(play);
            $(previous).removeClass("highlighted-beat");
            return;
        }
        
        if (changer <= 30){
            playback(current);
            $(previous).removeClass("highlighted-beat");
            $(current).addClass("highlighted-beat");
            changer++;
        }

        else {
            playback(current);
            $(previous).removeClass("highlighted-beat");
            $(current).addClass("highlighted-beat");
            changer = 0;
        }

    }, interval)
}
        
    

function playback(x){
    for (let i=0; i<x.length; i++){
        if (x[i].classList.contains("active-beat")){
            const re = /[^-]*/;
            const elem = `${x[i].id.match(re)}`
            let audioElement = new Audio(`${elem}.wav`);
            audioElement.volume = document.getElementById(`${elem}-range`).value;
            audioElement.play();
        }
    }
}


