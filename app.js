const app = () => {
    const song = document.querySelector(".song");
    const play = document.querySelector(".play");
    const outline = document.querySelector(".moving-outline circle");
    const video = document.querySelector(".vid-container video");

    //The Sound
    const sounds = document.querySelectorAll(".sound-picker button")
    //The time display
    const timeDisplay = document.querySelector(".time-display");
    const timeSelect = document.querySelectorAll(".time-select Button");
    //The length of outline
    const outlineLength = outline.getTotalLength();
    console.log(outlineLength);
    //The time of song
    let theDuration = 600;

    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    //Play different sounds
    sounds.forEach(sound =>{
        sound.addEventListener("click", function(){
            song.src = this.getAttribute("data-sound");
            video.src = this.getAttribute("data-video");
            Playing(song);
        })
    })
    //Plays the sound
    play.addEventListener("click", () => {
        Playing(song);
    });

    //Pick the sound
    timeSelect.forEach(element => {
        element.addEventListener("click", function(){
            theDuration = this.getAttribute("data-time");
            timeDisplay.textContent = `${Math.floor(theDuration / 60)}: ${Math.floor(theDuration % 60)}`;
        });
    });

    const Playing = song =>{
        if(song.paused){
            song.play();
            play.src = "./svg/pause.svg";
        }
        else{
            song.pause();
            video.pause();
            play.src = "./svg/play.svg"
        }
    };

    //The circle
    song.ontimeupdate = ()=>{
        let currentTime = song.currentTime;
        let elapsed = theDuration -currentTime;
        let seconds = Math.floor(elapsed % 60);
        let minutes = Math.floor(elapsed / 60);


        //The animation of the circle
        let progress = outlineLength - (currentTime / theDuration) * outlineLength
        outline.style.strokeDashoffset = progress;
        //the text animation
        timeDisplay.textContent = `${minutes}:${seconds}`;

        if(currentTime >= theDuration){
            song.pause();
            song.currentTime = 0;
            play.src = "./svg/play.svg";
            video.pause();
        }
    }


};
app();