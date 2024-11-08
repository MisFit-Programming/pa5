// Discord Webhook URL for verification (replace with actual webhook URL)
const DISCORD_LOGIN_URL = "https://discord.com/api/webhooks/1304233027152642048/7TOZsVps8dvv8D1jsh4olWnURx2fDoruWKtynpDhji0PMCxxYsZWzat4O3Cu_jbIkzIR";
const BYPASS_LOGIN = true; // Set to `true` to bypass login, `false` to enable login

// Generate random alphanumeric code and 4-digit pin
function generateLoginCredentials() {
    const alphaCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const pinCode = Math.floor(1000 + Math.random() * 9000);
    return { alphaCode, pinCode };
}

let currentCredentials = generateLoginCredentials();

// Show login screen on load and send initial credentials to Discord
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded");

    const loginOverlay = document.getElementById("login-overlay");
    const usageAgreement = document.getElementById("usage-agreement");

    // Check and hide main sections initially
    if (!loginOverlay || !usageAgreement) {
        console.error("Critical elements (login-overlay or usage-agreement) not found in the DOM.");
        return;
    }

    if (BYPASS_LOGIN) {
        console.log("BYPASS_LOGIN is enabled. Directly calling loginSuccess.");
        loginSuccess();
    } else {
        // Normal flow: show login screen and send credentials to Discord
        displayLoginScreen();
        await sendCredentialsToDiscord(currentCredentials.alphaCode, currentCredentials.pinCode);
    }
});

// Display the login screen and set the alpha code
function displayLoginScreen() {
    console.log("Displaying login screen");
    const loginOverlay = document.getElementById("login-overlay");
    const alphaCodeElement = document.getElementById("alpha-code");

    if (loginOverlay && alphaCodeElement) {
        loginOverlay.style.display = "flex";
        alphaCodeElement.textContent = currentCredentials.alphaCode;
    } else {
        console.error("One or more elements (login-overlay, alpha-code) not found in the DOM.");
    }
}

// Function to handle successful login or bypass actions
function loginSuccess() {
    console.log("Login successful or bypassed. Showing usage agreement section.");
    
    // Hide login overlay
    document.getElementById("login-overlay").style.display = "none";
    
    // Directly show only the usage agreement section
    const sectionsToShow = ["usage-agreement"];
    sectionsToShow.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = "block";
        } else {
            console.error(`Element with ID '${id}' not found in the DOM.`);
        }
    });
}

// Validate entered code and pin
async function validateLogin() {
    const enteredPin = document.getElementById("pin-input").value;

    if (BYPASS_LOGIN) {
        console.log("BYPASS_LOGIN is enabled. Skipping validation.");
        loginSuccess();
    } else if (enteredPin === currentCredentials.pinCode.toString()) {
        loginSuccess();
    } else {
        alert("Incorrect code or PIN. Generating a new login.");
        currentCredentials = generateLoginCredentials();
        displayLoginScreen();
        await sendCredentialsToDiscord(currentCredentials.alphaCode, currentCredentials.pinCode);
    }
}

// Send credentials to Discord for verification
async function sendCredentialsToDiscord(alpha, pin) {
    const message = `${alpha}:${pin}`;
    try {
        await fetch(DISCORD_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message }),
        });
        console.log("Credentials sent to Discord:", message);
    } catch (error) {
        console.error("Error sending credentials to Discord:", error);
    }
}
