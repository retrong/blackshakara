const loadHistory = async () => {
  const userObj = JSON.parse(localStorage.getItem("user"));

  let totalQuantity = 0;

  try {
    if (!userObj) {
      window.location.href = `/login.html?${new URLSearchParams({
        redirect: window.location.href,
      }).toString()}`;

      return;
    }
    const token = userObj.token;

    const rawResponse = await fetch(`${API_URL}/order/product/history`, {
      mode: "cors",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: token,
      },
    });

    console.log("Here");

    if (rawResponse.status !== 200) {
      alert("Purchase history could not be loaded");

      return;
    }

    const jsonResponse = await rawResponse.json();

    jsonResponse.products.forEach((product) => {
      totalQuantity++;
      $("#order-history").append($.parseHTML(generateSideCartItems(product)));
    });

    jsonResponse.bespokes.forEach((product) => {
      totalQuantity++;
      $("#order-history").append($.parseHTML(generateSideCartItems(product)));
    });

    if (totalQuantity <= 0) {
      $("#user-history-table-container").append(
        $.parseHTML(
          `<p class="emp-cart-msg smallTag" style="column-span: all;">No products purchased yet!</p>`
        )
      );
    }

    // const productItem = jsonResponse.item;
    // globalProduct = productItem;
  } catch (error) {
    console.log(error);
  } finally {
    $("#ec-overlay").fadeOut("slow");
  }
};

loadHistory();

function getDate(date) {
  let myDate = new Date(date);
  let day = myDate.getDate();
  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][myDate.getMonth()];
  return `${day} ${month} ${myDate.getFullYear()}`;
}

const generateUserHistoryItem = (product) => {
  return `<tr>
    <th scope="row"><span>${product.id}</span></th>
    <td>
      <img
        class="prod-img"
        src="${product.image}"
        alt="product image"
      />
    </td>
    <td><span>${product.name}</span></td>
    <td><span>${getDate(product.date)}</span></td>
    <td><span>₦${product.price}</span></td>
    <td><span>${product.status}</span></td>
    <td>
      <span class="tbl-btn"
        ><a class="btn btn-lg btn-primary" href="#"
          >View</a
        ></span
      >
    </td>
  </tr>`;
};
