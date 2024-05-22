const findLoadingData = () => {
    const elements = document.querySelectorAll('.gib-loading');
    let requestData = [];

    elements.forEach(el => {
        const variantId = el.getAttribute('data-variant');
        const productId = el.getAttribute('data-product');
        const hasIcon = el.getAttribute('data-icon');
        let alreadyInCart = el.getAttribute('data-in-cart') || "0";

        if (variantId !== '' && productId !== '') {
            requestData.push({ variantId, productId, hasIcon, alreadyInCart, element: el });
        }
    });

    return requestData; 
};

const getGibDates = async (requestData) => {

    const url = 'https://charterhouse-shopify-test-app.gadget.app/getDispatchDate';
    const batchData = requestData.map(data => ({
        product_ids: data.productId,
        variant_id: data.variantId,
        market: "22015344775",
        already_in_cart: data.alreadyInCart
    }));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batchData),
        });

        const responseData = await response.json();

        responseData.forEach((data, index) => {
            applyGibDate(requestData[index], data);
        });
    } catch (error) {
        console.error('Error in batch request:', error);
    }
};

/**
 * Apply Get It By Dates from batch response
 */
const applyGibDate = ({ element, hasIcon }, data) => {

    let icon = "";
    if(hasIcon === "true"){
        if (data.in_stock && data.purchasable) {
            icon = `<i class="fa-fw fa-sharp fa-light fa-circle-check"></i>`;
        } else if (!data.in_stock && data.purchasable) {
            icon = `<i class="fa-fw fa-sharp fa-light fa-clock"></i>`;
        } else {
            icon = `<i class="fa-fw fa-sharp fa-light fa-times"></i>`;
        }
    }

    let content = "";
    if (data.in_stock && data.purchasable) {
        content = `<div class="gib-text gib-text--ok">${icon} Get it by ${data.pretty_earliest_delivery}</div>`;
    } else if (!data.in_stock && data.purchasable) {
        content = `<div class="gib-text gib-text--info">${icon} Dispatch in ${data.days_to_dispatch}</div>`;
    } else {
        content = `<div class="gib-text gib-text--warn">${icon} Sold out</div>`;
    }

    element.innerHTML = content;
    element.classList.remove("gib-loading");
};

const scheduleGibCheck = () => {
    const requestData = findLoadingData();
    if(requestData.length > 0){
        //console.log(`Getting ${requestData.length} GiB items.`);
        getGibDates(requestData).then(() => {
            // Schedule the next check after the current request completes
            setTimeout(scheduleGibCheck, 1000);
        });
    } else {
       // console.log(`0 GiB items. Skipping...`);
        // Still need to schedule the next check
        setTimeout(scheduleGibCheck, 1000);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    scheduleGibCheck();
});