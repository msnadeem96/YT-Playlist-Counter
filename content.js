(() => {

    const TIMEOUT_MS = 30000; // time after which to stop trying to check for the presence of playlist box

    function msToTime(ms) {
        let seconds = Math.floor((ms / 1000) % 60);
        let minutes = Math.floor((ms / (1000 * 60)) % 60);
        let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    const inv = setInterval(() => {
        const playlist = document.querySelector('ytd-playlist-panel-renderer#playlist.ytd-watch-flexy')

        if (playlist === null) {
            return
        }

        const totalVideosElement = playlist.querySelector('.index-message.ytd-playlist-panel-renderer .yt-formatted-string:last-of-type')
        const totalVideos = parseInt(totalVideosElement.innerHTML.trim())
        const times = Array.from(playlist.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer>#time-status>#text.ytd-thumbnail-overlay-time-status-renderer')).map((v, i) => {
            return v.innerText.trim()
        })

        // if (times.length !== parseInt(totalVideos)) {
        //     return
        // }

        const ms = times.reduce((total, v) => {
            const parts = v.split(':');
            let hrs = 0, mins = 0, secs = 0;

            if (parts.length == 3) {
                // we have hours as well
                hrs = Number(v.split(':')[0]) * 60 * 60 * 1000 // <hrs> * mins * secs * ms
                mins = Number(v.split(':')[1]) * 60 * 1000 // <mins> * secs * ms
                secs = Number(v.split(':')[2]) * 1000 // <secs> * ms
            } else {
                // we only have mins and seconds, no hours
                mins = Number(v.split(':')[0]) * 60 * 1000 // <mins> * secs * ms
                secs = Number(v.split(':')[1]) * 1000 // <secs> * ms
            }

            return total + hrs + mins + secs;
        }, 0)

        // const timeStrElement = totalVideosElement.cloneNode()

        // timeStrElement.classList.add('My')

        totalVideosElement.innerHTML = "" + totalVideos + "&nbsp; (~ " + msToTime(ms) + ")";

        // totalVideosElement.after(timeStrElement)
        // clearInterval(inv)
    }, 200)

    setTimeout(() => {
        clearInterval(inv)
    }, TIMEOUT_MS);

})()