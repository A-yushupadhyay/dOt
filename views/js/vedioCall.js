function endCall() {
    window.location.href = "/home"; // Redirect to home after call
}

// Fetch video call link dynamically
async function fetchVideoCall() {
    const appointmentId = "APPOINTMENT_ID"; // Replace with dynamic ID
    const response = await fetch(`/videoCall/${appointmentId}`);
    const data = await response.json();
    
    if (data.link) {
        document.getElementById("video-frame").src = data.link;
    } else {
        alert("Video call link not available.");
    }
}

fetchVideoCall();
