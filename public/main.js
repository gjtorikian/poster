const messages = document.querySelector(".messages");
const socket = io();

socket.on("message", function (data) {
  addMessage(data);
});

function addMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = message;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
}
