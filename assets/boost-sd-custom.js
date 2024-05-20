// /*********************** Custom JS for Boost AI Search & Discovery  ************************/
function applyGetItByDatesBoostSD() {
  $(".gib-container").each(function () {
    let variantId = $(this).attr("data-variant");
    let productId = $(this).attr("data-product");
    let hasIcon = $(this).attr("data-icon");
    let alreadyInCart = $(this).attr("data-in-cart");

    if (!alreadyInCart) {
      alreadyInCart = 0;
    }

    console.log("hasIcon", hasIcon);
    let container = $(this);
    if (variantId !== "" && productId !== "") {
      const url = "https://charterhouse-shopify-test-app.gadget.app/getDispatchDate";
      const data = {
        product_ids: productId,
        variant_id: variantId,
        market: "22015344775",
        already_in_cart: alreadyInCart,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Icons
          let icon = "";
          if (hasIcon) {
            console.log(hasIcon);
            if (data.in_stock == true && data.purchasable == true) {
              icon = `<i class="fa-fw fa-sharp fa-light fa-circle-check"></i>`;
            } else if (data.in_stock == false && data.purchasable == true) {
              icon = `<i class="fa-fw fa-sharp fa-light fa-clock"></i>`;
            } else {
              icon = `<i class="fa-fw fa-sharp fa-light fa-times"></i>`;
            }
          } else {
            console.log(hasIcon);
          }

          // Apply GiB date
          if (data.in_stock == true && data.purchasable == true) {
            container.html(`
              <div class="gib-text gib-text--ok">
                ${icon}
                Get it by ${data.pretty_earliest_delivery}
              </div>              
              `);
          } else if (data.in_stock == false && data.purchasable == true) {
            container.html(`
              <div class="gib-text gib-text--info">
                ${icon}
                Dispatch in ${data.days_to_dispatch}
              </div>              
                `);
          } else {
            // Totally out of stock, unpurchasable.
            if (hasIcon) {
              container.html(`
                <div class="gib-text gib-text--warn">
                  <i class="fa-sharp fa-light fa-times"></i>
                  Sold out
                </div>              
                  `);
            } else {
              container.find(">i").removeClass("fa-spinner");
            }
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      return;
    }
  });
}
window.addEventListener("boost-sd-add-multi-product-to-cart", (e) => {
  const { data, onSuccess, onFail } = e.detail;
  setTimeout(function () {
    fetch(`${routes.cart_url}?section_id=cart-drawer`)
      .then((response) => response.text())
      .then((responseText) => {
        const cartDrawerElm = document.querySelector("cart-drawer");
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const newCartDrawerHTML = html.querySelector("#CartDrawer").innerHTML;
        cartDrawerElm.querySelector("#CartDrawer").innerHTML = newCartDrawerHTML;
        cartDrawerElm.classList.remove("is-empty");
        cartDrawerElm.open();
        applyGetItByDatesBoostSD();
      });
  }, 1600);
});


if (window.boostSDAppConfig) {
    window.boostSDAppConfig.integration = Object.assign({
      labels: 'flair'
    }, window.boostSDAppConfig.integration || {});
  }

function getReadableDispatchDate(date) {
    const today = new Date();
    const dispatchDate = new Date(date);

    // Calculate the difference in days between today and the dispatch date
    const timeDiff = dispatchDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Define the readable format based on the difference in days
    let readableFormat;
    if (daysDiff === 0) {
        readableFormat = "Dispatches today";
    } else if (daysDiff === 1) {
        readableFormat = "Dispatches tomorrow";
    } else {
        readableFormat = `Dispatches in ${daysDiff} days`;
        // readableFormat = `Dispatches on ${days[dispatchDate.getDay()]}`;
    }

    return readableFormat;
}

const customize = {
    updateProductItem: (componentRegistry) => {
        componentRegistry.useComponentPlugin('ProductItem', {
        name: 'Modify Product Item HTML',
        enabled: true,
        apply: () => ({
            afterRender(element) {
                let productData = element.getParams().props.product;

                let availableVariantIds = productData.variants.map(variant => variant.id);

                let productItem = document.querySelector('.boost-sd__product-item[data-product-id="' + productData.id + '"]');

                productItem.querySelector('.boost-sd__inventory-status').innerHTML = `
                <div class="gib-container gib-loading" data-variant="${availableVariantIds[0]}" data-product="${productData.id}" data-icon="true" data-in-cart="0" style="padding-top: 5px;">
                    <i class="fa-fw fa-solid fa-spinner fa-spin-pulse"></i>
                </div>
                `;

                const flairEl = productItem.querySelector('[data-flair-product-badge]');
                if (flairEl) {
                    productItem.querySelector('.boost-sd__product-title').after(flairEl);
                }
            }
        }),
        });
    }
}

if(enable_get_it_by && enable_plp_get_it_by){
    window.__BoostCustomization__ = (window.__BoostCustomization__ ?? []).concat([customize.updateProductItem]);
}
