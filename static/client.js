import { processText } from "./modules/process-text.js";

const button = document.getElementById('submit-text');

const NODE_ENV = "development";

const protocol = (NODE_ENV === "production") ? "https" : "http";
const hostname = (NODE_ENV === "production") ? 'nikuchin.fun' : 'localhost:3000';

function showLoader() {
    const loader = document.getElementsByClassName("loader")[0];
    loader.style.setProperty('display', 'block');
}

function hideLoader() {
    const loader = document.getElementsByClassName("loader")[0];
    loader.style.setProperty('display', 'none');
}

function triggerError(errorMessage) {
    const alertArea = document.getElementsByClassName("alert")[0];
    alertArea.style.setProperty('background-color', "#f44336");

    const errorText = "ПАМЫЛКА: " + errorMessage;
    alertArea.innerHTML = alertArea.innerHTML.replace('\#', errorText);

    alertArea.style.setProperty('display', 'block');

    setTimeout(() => {
        alertArea.style.setProperty('display', 'none');
        alertArea.innerHTML = alertArea.innerHTML.replace(errorText, "#");
    }, 6000);
}

function triggerBadCharactersWarning(badCharacters) {
    const alertArea = document.getElementsByClassName("alert")[0];
    alertArea.style.setProperty('background-color', "#ff9800");
    alertArea.style.setProperty('display', 'block');

    const errorText = "УВАГА: вамі былі ўведзены сімвалы, якія не ўваходзяць у беларускі алфавіт ці ў знакі прыпынку: " + badCharacters + "  Яны выдалены.";
    alertArea.innerHTML = alertArea.innerHTML.replace('\#', errorText);
    setTimeout(() => {
        alertArea.style.setProperty('display', 'none');
        alertArea.innerHTML = alertArea.innerHTML.replace(errorText, "#");
    }, 6000);

}

function disableSendingButton() {
    document.getElementById('submit-text').disabled = true;
}

function enableSendingButton() {
    document.getElementById('submit-text').disabled = false;
}
button.addEventListener("click", function (e) {
    const submittedText = document.getElementById('submitting_form').value;
    
    const preprocessingResult = processText(submittedText);
    if (preprocessingResult.error === true) {
        triggerError(preprocessingResult.text);
        return ;
    }
    else if (preprocessingResult.error === false && "badCharacters" in preprocessingResult) {
        triggerBadCharactersWarning(preprocessingResult.badCharacters);
    }
    showLoader();
    disableSendingButton();
    axios({
        url: `${protocol}://${hostname}/tts`,
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
            text: preprocessingResult.text
        }
    }).then(response => {
        const filename = response.data.audio_name;
        const audio = new Audio(filename);
        console.log(audio);
        audio.controls = 'controls';
        ///audio.preload = 'auto';
        audio.id = 'audio-player';
        const parent_element = document.getElementById("media-div");
        const audio_element = document.getElementById(audio.id);
        console.log(audio_element);
        if (audio_element !== null) {
            audio_element.parentNode.removeChild(audio_element);
        }
        parent_element.appendChild(audio);
    }).catch(error => {
        const er_mes = error.message;
        console.log('error in getting response with the file name: ' + er_mes)
    }).finally(() => {
        enableSendingButton();
        hideLoader();
    })
});