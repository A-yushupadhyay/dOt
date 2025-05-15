document.addEventListener("DOMContentLoaded", function () {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        console.error("Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;

    const userInput = document.getElementById("user-input");
    const voiceInputButton = document.getElementById("voice-input");

    window.startVoiceInput = function () {
        recognition.start();
        voiceInputButton.disabled = true; // Disable while listening
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage(); // Auto-send after voice input
    };

    recognition.onspeechend = () => {
        recognition.stop();
        voiceInputButton.disabled = false;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        voiceInputButton.disabled = false;
    };
});
