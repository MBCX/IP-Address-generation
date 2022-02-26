import { generateRandomIPBasedOnCountry, generateRandomIP, convertToIPv6 } from "./ipAPI.js";

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector("[data-generate-ip-btn-el]");
    const ip_result = document.querySelector("[data-ip-result-el]");
    const ip_country_result = document.querySelector("[data-ip-country-result]");
    const range_specifier = document.querySelector("[data-ip-range-specifier-el]");
    const region_select = document.querySelector("[data-country-picker]");
    const region_index = document.querySelector("[data-country-index]");
    const region_generate_btn = document.querySelector("[data-generate-ip-country-btn-el]");

    // IPv6.
    const ip_result_ipv6 = document.querySelector("[data-ip-result-el-ipv6]");

    btn.addEventListener("click", () => {
        const ip = generateRandomIP(range_specifier.value);

        ip_result.innerText = ip;
        ip_result_ipv6.innerText = convertToIPv6(ip);
    });

    region_generate_btn.addEventListener("click", () => {
        const ip_result = generateRandomIPBasedOnCountry(
            region_index.innerText,
            10
        );

        region_generate_btn.setAttribute("disabled", true);
        ip_country_result.innerText = "Generating...";

        ip_result.then((res) => {
            region_generate_btn.removeAttribute("disabled");
            ip_country_result.innerText = res;
        });
    });

    region_select.addEventListener("mouseup", () => {
        region_index.innerText = region_select.value;
    });
});