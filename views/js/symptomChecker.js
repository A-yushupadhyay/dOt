let userId = localStorage.getItem("user_id") || Math.random().toString(36).slice(2, 11);
localStorage.setItem("user_id", userId);

function showTypingIndicator() {
    let chatBox = document.getElementById("chat-box");
    const typing = document.createElement("div");
    typing.classList.add("bot-message", "typing-indicator");
    typing.innerHTML = "Doctor AI is typing<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>";
    typing.id = "typing-indicator";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) {
        alert("Please enter a symptom.");
        return;
    }

    let chatBox = document.getElementById("chat-box");

    // Display user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message", "fade-in");
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    showTypingIndicator();

    try {
        let response = await fetch("http://localhost:8000/symptom-checker/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, symptom: userInput })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        let data = await response.json();
        hideTypingIndicator();

        // Emergency message handling
        if (data.status === "EMERGENCY") {
            const emergency = document.createElement("div");
            emergency.classList.add("bot-message", "fade-in");
            emergency.style.backgroundColor = "#ff4d4d";
            emergency.style.color = "#fff";
            emergency.innerHTML = `🚨 ${data.message}`;
            chatBox.appendChild(emergency);
        } else {
            // Main AI doctor reply
            if (data.doctor_reply) {
                const doctorReply = document.createElement("div");
                doctorReply.classList.add("bot-message", "fade-in");
                doctorReply.innerHTML = `🤖 ${data.doctor_reply.replace(/\n/g, "<br>")}`;
                chatBox.appendChild(doctorReply);
            }

            // Follow-up questions (show all)
            if (data.follow_up_questions && data.follow_up_questions.length > 0) {
                data.follow_up_questions.forEach(question => {
                    const followUp = document.createElement("div");
                    followUp.classList.add("bot-message", "fade-in");
                    followUp.textContent = `💬 ${question}`;
                    chatBox.appendChild(followUp);
                });
            }
        }

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        hideTypingIndicator();
        alert("An error occurred while communicating with the server. Please try again later.");
        console.error(error);
    }

    document.getElementById("user-input").value = "";
}
