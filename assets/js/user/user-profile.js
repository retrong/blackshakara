let userProfile;
let profile_pic;

const loadProfile = async () => {
  const userObj = JSON.parse(localStorage.getItem("user"));

  try {
    if (!userObj) {
      window.location.href = `/login.html?${new URLSearchParams({
        redirect: window.location.href,
      }).toString()}`;

      return;
    }
    const token = userObj.token;

    const rawResponse = await fetch(`${API_URL}/user/dashboard/`, {
      mode: "cors",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: token,
      },
    });

    if (rawResponse.status !== 302) {
      alert("Profile could not be loaded");

      return;
    }

    const jsonResponse = await rawResponse.json();

    userProfile = jsonResponse;

    $("#user-name").html(`${userProfile.firstname} ${userProfile.lastname}`);
    $("#user-greeting").html(
      `${userProfile.firstname} ${userProfile.lastname}`
    );
    $("#user-email").html(userProfile.email);
    $("#user-phone").html(userProfile.phone_number);
    $("#user-address").html(userProfile.address);
    $("#user-shipping-address").html(userProfile.address);

    if (userProfile.profile_pic) {
      $("#user-profile-picture").attr("src", userProfile.profile_pic);
    }

    populateForm();

    // const productItem = jsonResponse.item;
    // globalProduct = productItem;
  } catch (error) {
    console.log(error);
  } finally {
    $("#ec-overlay").fadeOut("slow");
  }
};

loadProfile();

const populateForm = () => {
  $("#firstname-field").val(userProfile.firstname);
  $("#lastname-field").val(userProfile.lastname);
  $("#email-field").val(userProfile.email);
  $("#phone-field").val(userProfile.phone_number);
  $("#address-field").val(userProfile.address);
  $("#ec-select-state").val(userProfile.state);
  $("#instagram-field").val(userProfile.instagram);
  $("#facebook-field").val(userProfile.facebook);
  $("#twitter-field").val(userProfile.twitter);

  if (userProfile.profile_pic) {
    $("#profile-pic-preview").attr("src", userProfile.profile_pic);
  }
};

const submitUserProfile = async (event) => {
  event.preventDefault();

  const userObj = JSON.parse(localStorage.getItem("user"));

  try {
    if (!userObj) {
      window.location.href = `/login.html?${new URLSearchParams({
        redirect: window.location.href,
      }).toString()}`;

      return;
    }
    const token = userObj.token;

    if (!profile_pic) {
      alert("Please select a profile picture");

      return;
    }

    $("#edit-submit-button").html("Updating");

    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData);

    const rawResponse = await fetch(`${API_URL}/user/dashboard/`, {
      mode: "cors",
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        ...formValues,
        profile_pic,
        auxiliary_phone_number: "",
      }),
    });

    const jsonResponse = await rawResponse.json();

    if (rawResponse.status !== 201) {
      alert(
        jsonResponse.message ||
          "An error has occurred. Please report this so we can investigate"
      );
    }
  } catch (error) {
    alert("An error has occurred. Please report this so we can investigate");
  } finally {
    $("#edit-submit-button").html("Update");
    loadProfile();
  }
};

function encodeImageFileAsURL() {
  var filesSelected = document.getElementById("thumbUpload02").files;

  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];

    var fileReader = new FileReader();

    fileReader.onload = function (fileLoadedEvent) {
      var srcData = fileLoadedEvent.target.result; // <--- data: base64

      profile_pic = srcData;
    };

    fileReader.readAsDataURL(fileToLoad);
  }
}

$("#editUserForm").on("submit", submitUserProfile);
