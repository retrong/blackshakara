const generateCarouselSlide = (product) => {
  return `<div class="ec-slide-item swiper-slide d-flex">
      <div class="container align-self-center">
        <div class="row">
          <div class="col-xl-6 col-lg-7 col-md-7 col-sm-7 align-self-center">
            <div class="ec-slide-content slider-animation">
              <h1 class="ec-slide-title">${product.title}</h1>
              <h2 class="ec-slide-stitle">${product.name}</h2>
              <p>
                NEW SALE!!!
              </p>
              <a href="/product.html?item=${product.id}" class="btn btn-lg btn-secondary">
                Order Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};

const fetchAndPopulateHomePage = async () => {
  const tag = document.getElementById("tag");

  try {
    const rawResponse = await fetch(`${API_URL}/home/`, {
      mode: "cors",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (rawResponse.status !== 200) {
      return;
    }

    const jsonResponse = await rawResponse.json();

    const sales_products = jsonResponse.sales_products;
    sales_products.forEach((productObj) => {
      const product = $.parseHTML(generateCarouselSlide(productObj));

      $("#swiper-wrapper-home").append(product);
    });

    const for_all = jsonResponse.for_all;

    for_all.forEach((productObj) => {
      const product = $.parseHTML(generateProductElement(productObj));

      $("#for-all-tab-pane").append(product);
    });

    const male_product = jsonResponse.male_product;
    male_product.forEach((productObj) => {
      const product = $.parseHTML(generateProductElement(productObj));

      $("#for-men-tab-pane").append(product);
    });

    const female_product = jsonResponse.female_product;
    female_product.forEach((productObj) => {
      const product = $.parseHTML(generateProductElement(productObj));

      $("#for-women-tab-pane").append(product);
    });

    const latest_arrivals = jsonResponse.latest_arrivals;
    female_product.forEach((productObj) => {
      const product = $.parseHTML(generateProductElement(productObj));

      $("#new-arrivals-home").append(product);
    });

    var EcMainSlider = new Swiper(".ec-slider.swiper-container", {
      loop: true,
      speed: 2000,
      effect: "slide",
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  } catch (err) {
    console.log(err);
    // tag.classList.add("tag");
    // tag.innerHTML =
    //   "An error has occurred. Please report this so we can investigate";
  }
};

const loadHomePage = async () => {
  await fetchAndPopulateHomePage();

  $("#ec-overlay").fadeOut("slow");
};

loadHomePage();
