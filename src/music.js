// Selectors for audio buttons
const playBtn = document.querySelector(".play"),
    skipForward = document.querySelector(".skip-forward"),
    skipBack = document.querySelector(".skip-back"),
// Selectors for track/progress bar elements
    progressBarContainer = document.querySelector('.progress'),
    progressBar = document.querySelector('.progress-bar'),
    progressHead = document.querySelector('.progress-head'),

    currentTimeHtml = document.querySelector(".current-time"),
    durationHtml = document.querySelector(".duration"),

    playIcon = document.querySelector('.fa-play'),
    img = document.querySelector('.img'),
    title = document.querySelector(".audio-title"),
    singer = document.querySelector(".audio-singer");

//Tracks
this.tracks = [
    {
        name: "Tech House vibes",
        artist: "Artist 1",
        cover: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?crop=entropy&cs=tinysrgb&fm=jpg",
        source: "https://assets.mixkit.co/music/download/mixkit-tech-house-vibes-130.mp3",
    },
    {
        name: "Jazz",
        artist: "Artist 2",
        cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?crop=entropy&cs=tinysrgb&fm=jpg",
        source: "https://assets.mixkit.co/music/download/mixkit-hip-hop-02-738.mp3",
    },
    {
        name: "Dreaming Big",
        artist: "Artist 3",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fm=jpg",
        source: "https://assets.mixkit.co/music/download/mixkit-dreaming-big-31.mp3",
    },
];

// Initial values
let audio = null,
    barWidth = null,
    duration = null,
    currentTime = null, //used for events when clicking on the play/pause button
    isTimerPlaying = false,
    currentTrackIndex = 0,
    currentTrack = tracks[0];

// Set initial state values and assign them to the initial values
audio = new Audio();
audio.src = currentTrack.source;
img.src = currentTrack.cover;
title.innerText = currentTrack.name;
singer.innerText = currentTrack.artist;

//Play music
playBtn.addEventListener('click', () => {
    //check if audio is currently playing
    if (audio.paused) {
        audio.play();
        //once music is playing, 'isTimerPlaying is set to true so it can be used when changing the data for the progress bar
        isTimerPlaying = true;
    } else {
        audio.pause();
        isTimerPlaying = false;
    }
});
//Adjusting progress head
progressBarContainer.addEventListener('click', (x) => {
    let maxduration = audio.duration;
    let position = x.pageX - progressBarContainer.offsetLeft;
    let percentage = (100 * position) / progressBarContainer.offsetWidth;
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;
    barWidth = percentage + "%";

    audio.currentTime = (maxduration * percentage) / 100;
    progressBar.style.width = `${barWidth}%`;
    progressHead.style.setProperty("left", `${barWidth}%`);
    img.src = currentTrack.cover;
});

//Skip Button
skipForward.addEventListener('click', () => {
    //check the cuurent track index
    if (currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
    } else {
        currentTrackIndex = 0;
    }
    //update current track
    currentTrack = tracks[currentTrackIndex];
    //changing source, image, title and name
    audio.src = currentTrack.source;
    img.src = currentTrack.cover;
    title.innerText = currentTrack.name;
    singer.innerText = currentTrack.artist;

    barWidth = 0;
    progressBar.style.width = `${barWidth}%`;
    progressHead.style.setProperty("left", `${barWidth}%`);
    currentTimeHtml.innerText = `0:00`;
    durationHtml.innerText = `0:00`;

    audio.currentTime = 0;
    audio.src = currentTrack.source;

    setTimeout(() => {
        if (isTimerPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, 300);
});
//Back button - similar to skip button but decrementing
skipBack.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
    } else {
        this.currentTrackIndex = this.tracks.length - 1;
    }
    currentTrack = tracks[currentTrackIndex];

    audio.src = currentTrack.source;
    img.src = currentTrack.cover;
    title.innerText = currentTrack.name;
    singer.innerText = currentTrack.artist;

    barWidth = 0;
    progressBar.style.width = `${barWidth}%`;
    progressHead.style.setProperty("left", `${barWidth}%`);
    currentTimeHtml.innerText = `0:00`;
    durationHtml.innerText = `0:00`;

    audio.currentTime = 0;
    audio.src = currentTrack.source;

    setTimeout(() => {
        if (isTimerPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, 300);
});
//Changing progress display of progress bar
audio.ontimeupdate = function () {
    //checking if audio has been played and caluclating the bar width value for the progress head
    if (audio.duration) {
        barWidth = (100 / audio.duration) * audio.currentTime;
        //duration in minutes 
        let durMin = Math.floor(audio.duration / 60);
        //duration in seconds
        let dursec = Math.floor(audio.duration - durMin * 60);
        //current minutes
        let curmin = Math.floor(audio.currentTime / 60);
        //current seconds
        let cursec = Math.floor(audio.currentTime - curmin * 60);

        if (durMin < 10) durMin = "0" + durMin;

        if (dursec < 10) dursec = "0" + dursec;

        if (curmin < 10) curmin = "0" + curmin;

        if (cursec < 10) cursec = "0" + cursec;
        //editing the duration variable and setting that to the current minute, then concatenate the duration in seconds
        duration = durMin + ":" + dursec;
        currentTime = curmin + ":" + cursec;

        progressBar.style.width = `${barWidth}%`;
        progressHead.style.setProperty("left", `${barWidth}%`)
        currentTimeHtml.innerText = `${currentTime}`;
        durationHtml.innerText = `${duration}`;
    //Changing play button to pause
        if (isTimerPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');


        } else {
            playIcon.classList.add('fa-play');
            playIcon.classList.remove('fa-pause');
        }
    }
};

audio.onended = function () { };

//Reference - code from https://www.youtube.com/watch?v=bxbidND_jrQ 