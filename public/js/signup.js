function togglePassword() {
    const input = document.getElementById("signupPassword");
    const eye = document.getElementById("eyeIcon");
    const eyeOff = document.getElementById("eyeOffIcon");
  
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    eye.classList.toggle("hidden", !isPassword);
    eyeOff.classList.toggle("hidden", isPassword);
  }
  