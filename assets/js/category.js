const queryString = window.location.search;
const parameters = Object.fromEntries(new URLSearchParams(queryString));

let page = parameters.page ? Number(parameters.page) : 1;

const fetchProductsByCategory = async () => {
  const tag = document.getElementById("tag");

  try {
    const rawResponse = await fetch(
      `${API_URL}/product/category/${parameters.sub}/?page=${page}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const jsonResponse = await rawResponse.json();

    if (rawResponse.status !== 200) {
      tag.classList.add("tag");
      tag.innerHTML =
        jsonResponse.message ||
        "An error has occurred. Please report this so we can investigate";

      return;
    }

    if (jsonResponse.items.length < 1) {
      tag.classList.add("tag");
      tag.innerHTML = jsonResponse.message || "Oops, no products found!";
      $("#num-items-shown").addClass("d-none");
    }

    for (let i = 0; i < jsonResponse.items.length; i++) {
      $("#products-container").append(
        $.parseHTML(generateProductElement(jsonResponse.items[i]))
      );
    }

    if (page === 1) {
      $("#prev-page").addClass("d-none");
    } else {
      $("#prev-page").attr("href", `${window.location.href}&page=${page - 1}`);
    }

    if (Math.ceil(jsonResponse.total_items / 24) === page || page === 1) {
      $("#next-page").addClass("d-none");
    } else {
      $("#next-page").attr("href", `${window.location.href}&page=${page + 1}`);
    }

    const startItems = page + 24 * (page - 1);

    $("#num-items-shown").html(
      `Showing ${startItems} - ${
        startItems + (jsonResponse.items.length || 1) - 1
      } of ${jsonResponse.total_items} item(s)`
    );
  } catch (err) {
    tag.classList.add("tag");
    tag.innerHTML =
      "An error has occurred. Please report this so we can investigate";
  }
};

const loadCategoriesPage = async () => {
  $("#category-h-list").html(`${parameters.main} &rsaquo; ${parameters.sub}`);

  const data = await fetch("../../data/categories.json");

  const categories = await data.json();

  const category = categories.filter((cat) => cat.name === parameters.main)[0];

  $("#category-image-span").css("background-image", `url('${category.image}')`);

  await fetchProductsByCategory();

  $("#ec-overlay").fadeOut("slow");
};

loadCategoriesPage();
