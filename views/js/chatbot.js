// document.addEventListener("DOMContentLoaded", function () {
//     const chatBox = document.getElementById("chat-box");
//     const userInput = document.getElementById("user-input");
//     const sendButton = document.getElementById("send-button");

//     function appendMessage(text, isUser) {
//         const message = document.createElement("div");
//         message.classList.add(isUser ? "user-message" : "bot-message");
//         message.innerText = text;
//         chatBox.appendChild(message);

//         // Scroll to the bottom smoothly
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     function sendMessage() {
//         const text = userInput.value.trim();
//         if (text === "") return;
//         appendMessage(text, true);
//         userInput.value = "";

//         fetch("/symptom-checker/analyze", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ symptom: text })
//         })
//         .then(response => response.json())
//         .then(data => {
//             appendMessage(data.response, false);
//             if (data.bookAppointment) {
//                 appendMessage("Would you like to book an appointment? ✅", false);
//             }
//             if (!document.querySelector(`.bot-message[data-response="${data.response}"]`)) {
//                 const botMessage = document.createElement("div");
//                 botMessage.classList.add("bot-message");
//                 botMessage.innerText = data.response;
//                 botMessage.setAttribute("data-response", data.response); // Prevent duplicate responses
//                 chatBox.appendChild(botMessage);
//                 chatBox.scrollTop = chatBox.scrollHeight;
//             }
        
//         })
//         .catch(() => appendMessage("Sorry, I couldn't process that.", false));
//     }

//     sendButton.addEventListener("click", sendMessage);
//     userInput.addEventListener("keypress", (e) => {
//         if (e.key === "Enter") sendMessage();
//     });
// });




document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");
    const sendBtn = document.getElementById("sendBtn");

    sendBtn.addEventListener("click", async () => {
        const userMessage = chatInput.value;
        if (!userMessage) return;

        // Display user message
        chatBox.innerHTML += `<div class="user-msg">User: ${userMessage}</div>`;

        // Send message to AI chatbot
        const response = await fetch("/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptom: userMessage }),
        });

        const data = await response.json();

        // Display AI response
        chatBox.innerHTML += `<div class="ai-msg">AI: Predicted Disease - ${data.predicted_disease}</div>`;

        // Show follow-up questions
        if (data.follow_up_questions.length > 0) {
            chatBox.innerHTML += `<div class="ai-msg">AI: Follow-up Question - ${data.follow_up_questions[0].question}</div>`;
        }

        chatInput.value = ""; // Clear input
    });
});

