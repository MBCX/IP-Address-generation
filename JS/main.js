import { generateIP, getRandomIPBasedOn, IP_COUNTRY_AND_CITY } from "./utils.js"

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector("[data-generate-ip-btn-el]");
    const ip_result = document.querySelector("[data-ip-result-el]");
    const range_specifier = document.querySelector("[data-ip-range-specifier-el]");
    
    btn.addEventListener("click", () => {
        const ip = generateIP(range_specifier.value);

        ip_result.innerText = ip.join(".");
    });
});