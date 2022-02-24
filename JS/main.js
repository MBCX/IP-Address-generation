import { generateIP, getRandomIPBasedOnCountry, COUNTRY, STATE } from "./utils.js"

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector("[data-generate-ip-btn-el]");
    const ip_result = document.querySelector("[data-ip-result-el]");
    const ip_country_result = document.querySelector("[data-ip-country-result]");
    const range_specifier = document.querySelector("[data-ip-range-specifier-el]");
    const region_select = document.querySelector("[data-country-picker]");
    const region_index = document.querySelector("[data-country-index]");
    const region_generate_btn = document.querySelector("[data-generate-ip-country-btn-el]");

    btn.addEventListener("click", () => {
        const ip = generateIP(range_specifier.value);

        ip_result.innerText = ip.join(".");
    });

    region_generate_btn.addEventListener("click", () => {
        const ip = getRandomIPBasedOnCountry(COUNTRY.US, STATE.US.NEW_YORK).then(() => {
            region_generate_btn.setAttribute("disabled", true);
        }).then((val) => {
            ip_country_result.innerText = val;
        });
    });

    region_select.addEventListener("mouseup", () => {
        region_index.innerText = region_select.value;
    });
});