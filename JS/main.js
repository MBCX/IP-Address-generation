import { generateRandomIPv4BasedOnCountry, generateRandomIPv4, convertToIPv6, generateRandomIPv6, convertToIPv4 } from "./ipAPI.js";
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
    const ip_result_ipv6_country = document.querySelector("[data-ip-country-result-ipv6]");

    // IPv6 conversion technology.
    const ipv6_generate_btn = document.querySelector("[data-generate-ipv6-btn-el]");
    const ipv6_generate_select_value = document.querySelector("[data-ipv6-generation-picker]");
    const ipv6_generate_result = document.querySelector("[data-ipv6-result]");
    const ipv6_generate_result_ipv4 = document.querySelector("[data-ipv6-ipv4-result]");

    btn.addEventListener("click", () => {
        const ip = generateRandomIPv4(range_specifier.value);

        ip_result.innerText = ip;
        ip_result_ipv6.innerText = convertToIPv6(ip);
    });


    ipv6_generate_btn.addEventListener("click", () => {
        ipv6_generate_result.innerText = generateRandomIPv6(document.querySelector("#full-random-ipv6").checked, false);
        const ip = convertToIPv4(ipv6_generate_result.innerText);

        document.querySelector("[data-ipv6-ipv4-result]").innerText = (ip === -1) ? "Can't convert this IPv6." : ip;
    });


    region_generate_btn.addEventListener("click", () => {
        const ip_result = generateRandomIPv4BasedOnCountry(
            region_index.innerText,
            10
        );

        region_generate_btn.setAttribute("disabled", true);
        ip_country_result.innerText = "Generating...";

        ip_result.then((res) => {
            region_generate_btn.removeAttribute("disabled");
            
            if (undefined == res) {
                ip_country_result.innerText = `No IPs found for ${region_index.innerText}, try again.`;
            } else {
                ip_country_result.innerText = res;
                ip_result_ipv6_country.innerText = convertToIPv6(res);
            }
        });
    });

    region_select.addEventListener("mouseup", () => {
        region_index.innerText = region_select.value;
    });
});