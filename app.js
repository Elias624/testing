
/*
 * CineIT Auth UI v2
 * Browser-side validation + API calls.
 * Authentication and SQL belong on your server.
 *
 * POST /api/auth/register { name, email, password }
 * POST /api/auth/login    { email, password }
 */

// =====================================
// API CONFIGURATION
// =====================================

const API_BASE_URL = "http://localhost:3000";

// =====================================
// HTML ELEMENTS
// =====================================

const registerForm = document.querySelector("#register-form");
const signinForm = document.querySelector("#signin-form");
const message = document.querySelector("#message");
const heading = document.querySelector("#heading");
const subheading = document.querySelector("#subheading");
const switchLine = document.querySelector("#switch-line");
const signinMode = document.querySelector("#signin-mode");
const registerMode = document.querySelector("#register-mode");

// =====================================
// LIGHT MODE / DARK MODE
// =====================================

const themeToggle = document.getElementById("themeToggle");

let currentTheme =
  localStorage.getItem("cineit-theme") || "dark";

function applyTheme() {
  document.documentElement.setAttribute(
    "data-theme",
    currentTheme
  );

  if (themeToggle) {
    themeToggle.textContent =
      currentTheme === "dark"
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
  }
}

// Apply saved theme when the page opens
applyTheme();

// Change theme when button is clicked
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    currentTheme =
      currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem("cineit-theme", currentTheme);

    applyTheme();
  });
}

// =====================================
// NOTIFICATION MESSAGES
// =====================================

function notify(text, kind = "error") {
  message.textContent = text;
  message.className = `message ${kind}`;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = "";
  message.className = "message";
}

// =====================================
// SIGN IN / CREATE ACCOUNT SWITCH
// =====================================

function changeMode(mode) {
  const signup = mode === "signup";

  registerForm.hidden = !signup;
  signinForm.hidden = signup;

  registerMode.classList.toggle("selected", signup);
  signinMode.classList.toggle("selected", !signup);

  registerMode.setAttribute(
    "aria-selected",
    String(signup)
  );

  signinMode.setAttribute(
    "aria-selected",
    String(!signup)
  );

  heading.textContent = signup
    ? "Create your CineIT account"
    : "Welcome back to CineIT";

  subheading.textContent = signup
    ? "Sign up to keep your movie plans close at hand."
    : "Sign in to pick up where your next movie night left off.";

  switchLine.innerHTML = signup
    ? 'Already part of CineIT? <button type="button" data-mode="login">Sign in</button>'
    : 'New to CineIT? <button type="button" data-mode="signup">Create an account</button>';

  clearMessage();
}

// Account mode buttons
document.querySelectorAll("[data-mode]").forEach(button => {
  button.addEventListener("click", () => {
    changeMode(button.dataset.mode);
  });
});

// Bottom switch link
switchLine.addEventListener("click", event => {
  const trigger = event.target.closest("[data-mode]");

  if (trigger) {
    changeMode(trigger.dataset.mode);
  }
});

// =====================================
// SHOW / HIDE PASSWORD
// =====================================

document.querySelectorAll("[data-password]").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(
      button.dataset.password
    );

    const show = input.type === "password";

    input.type = show ? "text" : "password";

    button.textContent = show ? "Hide" : "Show";
  });
});

// =====================================
// EMAIL VALIDATION
// =====================================

const isEmail = value =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// =====================================
// BACKEND API REQUEST
// =====================================

async function request(endpoint, data, button) {
  const originalLabel = button.innerHTML;

  button.disabled = true;
  button.textContent = "Please wait…";

  clearMessage();

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        credentials: "include",

        body: JSON.stringify(data)
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || "The request could not be completed."
      );
    }

    notify(
      result.message || "Your request was successful!",
      "success"
    );

    return result;

  } catch (err) {
    notify(
      err instanceof TypeError
        ? "Unable to contact the server. Check that your backend is running and the API URL is correct."
        : err.message
    );

    return null;

  } finally {
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
}

// =====================================
// CREATE ACCOUNT / REGISTRATION
// =====================================

registerForm.addEventListener("submit", async event => {
  event.preventDefault();

  const name = registerForm.elements.name.value.trim();
  const email = registerForm.elements.email.value.trim();
  const password = registerForm.elements.password.value;
  const confirm = registerForm.elements.confirmPassword.value;

  // Validate name
  if (name.length < 2) {
    return notify(
      "Please enter a name with at least two characters."
    );
  }

  // Validate email
  if (!isEmail(email)) {
    return notify(
      "Please enter a valid email address."
    );
  }

  // Validate password
  if (password.length < 12) {
    return notify(
      "Choose a password with at least 12 characters."
    );
  }

  // Confirm password
  if (password !== confirm) {
    return notify(
      "The passwords do not match."
    );
  }

  // Check terms
  if (!registerForm.elements.terms.checked) {
    return notify(
      "Please accept the Terms and Privacy Policy."
    );
  }

  // Send registration request
  const result = await request(
    "/api/auth/register",
    {
      name,
      email,
      password
    },
    registerForm.querySelector(".primary")
  );

  if (result) {
    registerForm.reset();
  }
});

// =====================================
// SIGN IN / LOGIN
// =====================================

signinForm.addEventListener("submit", async event => {
  event.preventDefault();

  const email = signinForm.elements.email.value.trim();
  const password = signinForm.elements.password.value;

  // Validate email
  if (!isEmail(email)) {
    return notify(
      "Please enter a valid email address."
    );
  }

  // Validate password
  if (!password) {
    return notify(
      "Please enter your password."
    );
  }

  // Send login request
  await request(
    "/api/auth/login",
    {
      email,
      password
    },
    signinForm.querySelector(".primary")
  );
});

// =====================================
// FORGOT PASSWORD
// =====================================

document.querySelector("#forgot").addEventListener("click", event => {
  event.preventDefault();

  notify(
    "Password recovery is not connected yet. Add a password-reset endpoint to your backend."
  );
});

// =====================================
// INITIAL PAGE SETTINGS
// =====================================

// Start with Create Account selected
changeMode("signup");
