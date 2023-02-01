const queryString = window.location.search;
const parameters = Object.fromEntries(new URLSearchParams(queryString));

let page = parameters.page ? Number(parameters.page) : 1;

const fetchWishlistItems = async () => {
  const userObj = JSON.parse(localStorage.getItem("user"));

  try {
    if (!userObj) {
      window.location.href = `/login.html?${new URLSearchParams({
        redirect: window.location.href,
      }).toString()}`;

      return;
    }

    const token = userObj.token;

    const rawResponse = await fetch(`${API_URL}/order/wishlist`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const jsonResponse = await rawResponse.json();

    if (rawResponse.status !== 200) {
      $("#tag").addClass("tag");

      $("#tag").html(
        jsonResponse.detail ||
          "An error has occurred. Please report this so we can investigate",
      );

      return;
    }

    const products = [
      ...(jsonResponse.products || []),
      ...(jsonResponse.bespoke || []),
    ];

    if (products.length < 0) {
      $("#tag").addClass("tag");

      $("#tag").html(jsonResponse.detail || "Oops, no products found!");

      return;
    }

    for (let i = 0; i < products.length; i++) {
      $("#products-container").append(
        $.parseHTML(generateProductElement(products[i])),
      );
    }
  } catch (err) {
    $("#tag").html(
      "An error has occurred. Please report this so we can investigate",
    );
  } finally {
    $("#ec-overlay").fadeOut("slow");
  }
};

fetchWishlistItems();
