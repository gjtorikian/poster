const messages = document.querySelector(".messages");
const socket = io.connect("http://localhost:5591");

const muted = document.getElementById("muted");

const ding = () => {
  // noinspection JSUnresolvedVariable
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "ding.wav");
  xhr.responseType = "arraybuffer";
  xhr.addEventListener("load", () => {
    playsound = (audioBuffer) => {
      let source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.loop = false;
      source.start();
    };

    audioCtx.decodeAudioData(xhr.response).then(playsound);
  });
  xhr.send();
};

socket.on("message", function (message, signal) {
  addMessage(message);
  if (signal && !muted.checked) {
    ding();
  }
});

function addMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = message;
  messages.appendChild(li);
}
