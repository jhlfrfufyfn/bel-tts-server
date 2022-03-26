const button = document.getElementById('submit-text');

const hostname = 'nikuchin.fun';
button.addEventListener("click", function (e) {
    const submitted_text = document.getElementById('submitting_form').value;
    axios({
        url: `http://${hostname}/tts`,
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data: {
            text: submitted_text
        }
    })
    .then(response => {
        const filename = response.data.audio_name;
        const audio = new Audio(filename);
        console.log(audio);
        audio.controls = 'controls';
        audio.id = 'audio-player';
        const parent_element = document.getElementById("media-div");
        const audio_element = document.getElementById(audio.id);
        console.log(audio_element);
        if (audio_element !== null) {
            audio_element.parentNode.removeChild(audio_element);
        }
        parent_element.appendChild(audio);
    })
    .catch(error => {
        const er_mes = error.message;
        console.log('error in getting response with the file name: ' + er_mes)
    });

});