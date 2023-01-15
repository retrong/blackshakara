const userRegistrationForm = document.getElementById("userRegistrationForm");

let formSubmitted = 0;

const passwordsAreValid = () => {
  const password = document.getElementById("password");
  const password2 = document.getElementById("password2");

  if (password.value !== password2.value) {
    password2.setCustomValidity("Passwords do not match");

    password2.reportValidity();

    return false;
  } else {
    password2.setCustomValidity("");

    password2.reportValidity();

    return true;
  }
};

const checkPasswords = () => {
  if (formSubmitted > 0) {
    passwordsAreValid();
  }
};

const submitRegisterForm = async (event) => {
  event.preventDefault();

  const registerButton = document.getElementById("submit-button");
  const tag = document.getElementById("tag");

  try {
    formSubmitted++;

    if (!passwordsAreValid()) return;

    tag.innerHTML = "";
    tag.classList.remove("error-tag");

    registerButton.innerHTML = "Registering";
    registerButton.disable = true;

    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData);

    formValues.username = formValues.email;

    const rawResponse = await fetch(`${API_URL}/user/register/`, {
      mode: "cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    const jsonResponse = await rawResponse.json();

    if (rawResponse.status !== 201) {
      tag.classList.add("error-tag");
      tag.innerHTML =
        jsonResponse.message ||
        "An error has occurred. Please report this so we can investigate";

      return;
    }

    tag.innerHTML = "Registration successful";
    tag.classList.add("success-tag");

    window.location.href = "/login.html";
  } catch (error) {
    tag.classList.add("error-tag");
    tag.innerHTML =
      "An error has occurred. Please report this so we can investigate";
  } finally {
    registerButton.innerHTML = "Register";
    registerButton.removeAttribute("disabled");
  }
};

userRegistrationForm.addEventListener("submit", submitRegisterForm);
