const queryString = window.location.search;
const parameters = Object.fromEntries(new URLSearchParams(queryString));

let inStock = 0;
let globalProduct;

const generateImageCover = (image) => {
  return `<div class="single-slide zoom-image-hover">
      <img
        class="img-responsive"
        src="${image}"
        alt=""
      />
    </div>`;
};

const generateImageThumb = (image) => {
  return `<div class="single-slide">
      <img
        class="img-responsive"
        src="${image}"
        alt=""
      />
    </div>`;
};

const generateProductSizeElement = (sizes) => {
  return `<div class="ec-pro-variation-inner ec-pro-variation-size">
      <span>SIZE</span>
      <div class="ec-pro-variation-content">
        <ul>
          <li class="active">
            <span>7</span>
          </li>
          <li>
            <span>8</span>
          </li>
          <li>
            <span>9</span>
          </li>
        </ul>
      </div>
    </div>`;
};

const loadProduct = async () => {
  try {
    const rawResponse = await fetch(
      `${API_URL}/product/single/${parameters.item}/`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (rawResponse.status !== 200) {
      $("#product-name").html("Product not found!");

      return;
    }

    const jsonResponse = await rawResponse.json();

    const productItem = jsonResponse.item;
    globalProduct = productItem;

    $("#product-title").html(productItem.title);
    $("#product-name").html(productItem.name);
    $("#product-description").html(productItem.description);
    $("#product-price").html(`₦${productItem.price}`);
    $("#product-in-stock").html(productItem.quantity);

    inStock = productItem.quantity;

    const relatedProduct = jsonResponse.similar_products;
    relatedProduct.forEach((product) => {
      $("#related-product-container").append(
        $.parseHTML(generateProductElement(product))
      );
    });

    let rating = Math.round(productItem.rating || 0);

    $("#product-rating").append(
      $.parseHTML(`<span>${productItem.rating || 0}</span>&nbsp;&nbsp;`)
    );

    Object.keys(productItem)
      .filter((key) => key.includes("image"))
      .forEach((potentialImage) => {
        const imageUrl = productItem[potentialImage];

        if (typeof imageUrl === "string") {
          $("#image-carousel-cover").append(generateImageCover(imageUrl));
          $("#image-carousel-thumb").append(generateImageThumb(imageUrl));
        }
      });

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        $("#product-rating").append($.parseHTML(generateRatingItem(true)));
      } else {
        $("#product-rating").append($.parseHTML(generateRatingItem(false)));
      }
    }

    $(".single-product-cover").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      asNavFor: ".single-nav-thumb",
    });

    $(".single-nav-thumb").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: ".single-product-cover",
      dots: false,
      arrows: true,
      focusOnSelect: true,
    });

    $("#quantity-input").attr({
      max: inStock,
      min: 1,
    });

    if (inStock < 1) {
      $("#quantity-input").attr("disabled", true);
      $("#add-to-cart-btn").attr("disabled", true);
    }
  } catch (error) {
    console.log(error);
  } finally {
    $("#ec-overlay").fadeOut("slow");
  }
};

loadProduct();

$("#add-to-wishlist-btn").on("click", async function () {
  await addToWishlist(globalProduct.slug, globalProduct.type);
});

$("#add-to-cart-btn").on("click", async function () {
  const quantity = Number($("#quantity-input").val());

  if (quantity > inStock) {
    alert("Not enough item in stock");

    return;
  }
  $("#add-to-cart-btn").html("Adding");

  await addToCart(globalProduct.slug, quantity, globalProduct.type);

  $("#add-to-cart-btn").html("Add To Cart");
});
