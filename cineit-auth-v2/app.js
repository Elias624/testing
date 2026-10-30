/*
 * CineIT auth UI v2.
 * Browser-side validation + API calls; authentication and SQL belong on your server.
 * POST /api/auth/register { name, email, password }
 * POST /api/auth/login    { email, password }
 */
const API_BASE_URL = ""; // Set this if your API is hosted on another origin.
const registerForm = document.querySelector("#register-form");
const signinForm = document.querySelector("#signin-form");
const message = document.querySelector("#message");
const heading = document.querySelector("#heading");
const subheading = document.querySelector("#subheading");
const switchLine = document.querySelector("#switch-line");
const signinMode = document.querySelector("#signin-mode");
const registerMode = document.querySelector("#register-mode");

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
function changeMode(mode) {
  const signup = mode === "signup";
  registerForm.hidden = !signup;
  signinForm.hidden = signup;
  registerMode.classList.toggle("selected", signup);
  signinMode.classList.toggle("selected", !signup);
  registerMode.setAttribute("aria-selected", String(signup));
  signinMode.setAttribute("aria-selected", String(!signup));
  heading.textContent = signup ? "Create your CineIT account" : "Welcome back to CineIT";
  subheading.textContent = signup
    ? "Sign up to keep your movie plans close at hand."
    : "Sign in to pick up where your next movie night left off.";
  switchLine.innerHTML = signup
    ? 'Already part of CineIT? <button type="button" data-mode="login">Sign in</button>'
    : 'New to CineIT? <button type="button" data-mode="signup">Create an account</button>';
  clearMessage();
}
document.querySelectorAll("[data-mode]").forEach(el => {
  el.addEventListener("click", () => changeMode(el.dataset.mode));
});
switchLine.addEventListener("click", event => {
  const trigger = event.target.closest("[data-mode]");
  if (trigger) changeMode(trigger.dataset.mode);
});
document.querySelectorAll("[data-password]").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.password);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "Hide" : "Show";
  });
});
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

async function request(endpoint, data, button) {
  const label = button.innerHTML;
  button.disabled = true;
  button.textContent = "Please wait…";
  clearMessage();
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      credentials: "include",
      body: JSON.stringify(data)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "The request could not be completed.");
    notify(result.message || "Your request was accepted by the server.", "success");
    return result;
  } catch (err) {
    notify(err instanceof TypeError
      ? "Unable to contact the server. Check that your backend is running and the API URL is correct."
      : err.message);
    return null;
  } finally {
    button.disabled = false;
    button.innerHTML = label;
  }
}

registerForm.addEventListener("submit", async event => {
  event.preventDefault();
  const name = registerForm.elements.name.value.trim();
  const email = registerForm.elements.email.value.trim();
  const password = registerForm.elements.password.value;
  const confirm = registerForm.elements.confirmPassword.value;
  if (name.length < 2) return notify("Please enter a name with at least two characters.");
  if (!isEmail(email)) return notify("Please enter a valid email address.");
  if (password.length < 12) return notify("Choose a password with at least 12 characters.");
  if (password !== confirm) return notify("The passwords do not match.");
  if (!registerForm.elements.terms.checked) return notify("Please accept the Terms and Privacy Policy.");
  const result = await request("/api/auth/register", {name, email, password}, registerForm.querySelector(".primary"));
  if (result) registerForm.reset();
});
signinForm.addEventListener("submit", async event => {
  event.preventDefault();
  const email = signinForm.elements.email.value.trim();
  const password = signinForm.elements.password.value;
  if (!isEmail(email)) return notify("Please enter a valid email address.");
  if (!password) return notify("Please enter your password.");
  await request("/api/auth/login", {email, password}, signinForm.querySelector(".primary"));
});
document.querySelector("#forgot").addEventListener("click", event => {
  event.preventDefault();
  notify("Password recovery is not connected yet. Add a password-reset endpoint to your backend.");
});
