class Deck {
    constructor(){
      const instruments = ["cymbal", "hat", "snare", "kick"];
      const beats = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
      for (let instrument in instruments){
        for (let beat in beats){
            let current = document.getElementById(`${instruments[instrument]}-wrapper`);
            current.innerHTML += `<button class="beat beat${beats[beat]}" id="${instruments[instrument]}-beat${beats[beat]}"></button>`;
            current.innerHTML += `<audio id="${instruments[instrument]}-beat${beats[beat]}-play" src="${instruments[instrument]}.wav" type="audio/wav"></audio>`;
        }
      }
    }
  }


function activeBeatListner () {
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

new Deck();
activeBeatListner();

document.getElementById("kick-the-jams").addEventListener("click", visualScroll);

function visualScroll(){
    var player = document.getElementById("kick-the-jams");
    player.innerHTML == "stop the jams" ?
    player.innerHTML = "kick the jams" :
    player.innerHTML = "stop the jams";
    
    let bpm = parseInt(document.getElementById("bpm").value, 10);
    let interval = (60000 / bpm) / 4;
    let changer = 0;

        if (!isNaN(bpm)){
                    
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
        else { 
            alert("please enter a tempo");
            player.innerHTML = "kick the jams";
        };
    }

function playback(x){
    Array.from(x).forEach(i => {
        const elem = document.getElementById(`${i.id}-play`);
        
        if (i.classList.contains("active-beat")){
            elem.load();
            elem.play();
        }
    })
}


