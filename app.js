const app = () => {
    const song = document.querySelector(".song");
    const play = document.querySelector(".play");
    const outline = document.querySelector(".moving-outline circle");
    const video = document.querySelector(".vid-container video");

    //The Sound
    const sounds = document.querySelectorAll(".sound-picker button")
    //The time display
    const timeDisplay = document.querySelector(".time-display");
    //The length of outline
    const outlineLength = outline.getTotalLength();
    console.log(outlineLength);
    //The time of song
    let theDuration = 600;

    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    
    play.addEventListener("click", () => {
        song.play();
    });

    const Playing = song =>{
        if(song.paused){
            song.play();
            play.src = "./svg/pause.svg";
        }
        else{
            song.pause();
            play.src = "./svg/play.svg"
        }
    }


};
app();