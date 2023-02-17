const userLoginForm = document.getElementById("userLoginForm");

const submitLoginForm = async (event) => {
  event.preventDefault();

  const login = document.getElementById("submit-button");
  const tag = document.getElementById("tag");

  try {
    tag.innerHTML = "";
    tag.classList.remove("error-tag");

    login.innerHTML = "Logging In";
    login.disable = true;

    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData);

    const rawResponse = await fetch(`${API_URL}/user/staffs/login/`, {
      mode: "cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    const jsonResponse = await rawResponse.json();

    if (rawResponse.status !== 200) {
      tag.classList.add("error-tag");
      tag.innerHTML =
        jsonResponse.message ||
        "An error has occurred. Please report this so we can investigate";

      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        username: jsonResponse.username,
        email: jsonResponse.email,
        token: jsonResponse.token,
      }),
    );

    tag.innerHTML = "Login in successful";
    tag.classList.add("success-tag");

    window.location.href = "/";
  } catch (error) {
    tag.classList.add("error-tag");
    tag.innerHTML =
      "An error has occurred. Please report this so we can investigate";
  } finally {
    login.innerHTML = "Login";
    login.removeAttribute("disabled");
  }
};

userLoginForm.addEventListener("submit", submitLoginForm);
