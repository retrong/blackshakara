const generateCartItem = (product) => {
  return `
    <tr>
      <td
        data-label="Product"
        class="ec-cart-pro-name"
      >
        <a href="product.html?item=${product.slug}"
          ><img
            class="ec-cart-pro-img mr-4"
            src="${product.image}"
            alt="${product.title}"
          />${product.title}</a
        >
      </td>
      <td
        data-label="Price"
        class="ec-cart-pro-price"
      >
        <span class="amount">₦${currencyFormatter.format(product.price)}</span>
      </td>
      <td
        data-label="Quantity"
        class="ec-cart-pro-qty"
        style="text-align: center"
      >
        ${product.quantity}
      </td>
      <td
        data-label="Total"
        class="ec-cart-pro-subtotal"
      >
        ₦${currencyFormatter.format(product.price)}
      </td>
      <td
        data-label="Remove"
        class="ec-cart-pro-remove"
        href="removeCartItem(${product.slug})"
      >
        <a href="#"><i class="ecicon eci-trash-o"></i></a>
      </td>
    </tr>
    <li>
      <a
        href="product.html?item=${product.slug}"
        class="sidekka_pro_img"
        ><img
          src="${product.image}"
          alt="${product.title}"
      /></a>
      <div class="ec-pro-content">
        <a
          href="product.html?item=${product.slug}"
          class="cart_pro_title"
          >${product.title}</a
        >
        <span class="cart-price"><span>₦${currencyFormatter.format(
          product.price,
        )}</span> x ${product.quantity}</span>
        <a
          href="removeItemFromCart(${product.slug})"
          class="remove"
          >×</a
        >
      </div>
    </li>
  `;
};

let totalPrice = 0;
let totalQuantity = 0;

const loadCartItems = async () => {
  const userObj = JSON.parse(localStorage.getItem("user"));

  try {
    if (!userObj) {
      return;
    }

    const token = userObj.token;

    const rawResponse = await fetch(`${API_URL}/order/cart`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const jsonResponse = await rawResponse.json();

    if (rawResponse.status !== 200) {
      $.notify(
        jsonResponse.detail ||
          "An error has occurred. Please report this so we can investigate.",
        "error",
      );

      return;
    }

    $("#cart-table").empty();

    jsonResponse.Product.forEach((product) => {
      totalQuantity += product.quantity;
      totalPrice += product.price * product.quantity;
      $("#cart-table").append($.parseHTML(generateCartItem(product)));
    });

    jsonResponse.custom.forEach((product) => {
      totalQuantity += product.quantity;
      totalPrice += product.price * product.quantity;
      $("#cart-table").append($.parseHTML(generateCartItem(product)));
    });

    if (totalQuantity < 0) {
      $("#cart-table").append(
        $parseHTML(`<tr><p class="emp-cart-msg">Your cart is empty!</p><tr>`),
      );
    }

    $("#cart-total").text(`₦${currencyFormatter.format(totalPrice)}`);
  } catch (error) {
    console.log(error);
  }
};

loadCartItems();

$("#ec-select-state").on("change", (e) => {
  let optionSelected = $("option:selected", this);
  let valueSelected = this.value;

  const deliveryFee = (Math.floor(Math.random() * 10) + 1) * 1000;

  $("#delivery-fee").text(`₦${currencyFormatter.format(deliveryFee)}`);
  $("#cart-total").text(
    `₦${currencyFormatter.format(totalPrice + deliveryFee)}`,
  );
});
