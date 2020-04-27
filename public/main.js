const messages = document.querySelector(".messages");
const socket = io.connect("http://localhost:5591");

socket.on("message", function (data) {
  addMessage(data);
});

function addMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = message;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
}
