import { randomNumberBetween, convertFromDecimalToHex, convertFromHexToDecimal } from "./utils.js";

/**
 * Splits an IP range into an array. The IPs must be splitted
 * either by a | or a - character. Returns -1 otherwhise.
 * @param {String} ip IP range.
 * @returns An array from the splitted IP range.
 */
export function convertIPRangeToArray(ip) {
    const final_ip_array = new Array();
    if (ip.includes("|") || ip.includes("-")) {
        if (ip.includes("|")) {
            ip = ip.split("|");
        } else if (ip.includes("-")) {
            ip = ip.split("-");
        }

        // With the now split IP ranges, split
        // each individual IP to a individual array.
        ip.forEach((individual_ip) => {
            if (individual_ip.includes(".")) {
                final_ip_array.push(splitIPv4dots(individual_ip));
            }
        });
        return final_ip_array;
    } else {
        console.error(`The following IP: ${ip} is not splitted with | or -.`);
        return -1;
    }
}

export function splitIPv4dots(ip) {
    return ip.split(".");
}

/**
 * Util to convert IPv4 to IPv6.
 * @param {(String | Number[])} ipv4 The IPv4 address.
 */
export function convertToIPv6(ipv4)
{
    const ipv6_prefix = "0:0:0:0:0:ffff:";
    let ipv6_result = ipv6_prefix;

    // Check if we have to deal with multiple IPv4s.
    if (
        Array.isArray(ipv4) ||
        ipv4.includes("|") ||
        ipv4.includes("-")
    ) {
        if (ipv4.includes("|")) {
            ipv4 = ipv4.split("|");
        } else if (ipv4.includes("-")) {
            ipv4 = ipv4.split("-");
        }
        const result_ips = new Array();
        const current_hex_ip = new Array();

        ipv4.forEach((ip) => {
            const ip_splitted = splitIPv4dots(ip);
            
            // Resets hex conversions for the next ip.
            current_hex_ip.length = 0;
            ip_splitted.forEach((ip_number, i) => {
                if ((i % 3) === 2) {
                    current_hex_ip[current_hex_ip.length - 1] += ":";
                }
                current_hex_ip.push(convertFromDecimalToHex(ip_number));
            });
            
            result_ips.push(ipv6_prefix + current_hex_ip.join(""));
        });
        return result_ips;
    } else {
        const ip_splitted = splitIPv4dots(ipv4);
        ip_splitted.forEach((ip, i) => {
            if (2 === i) {
                ipv6_result += ":";
            }
            ipv6_result += convertFromDecimalToHex(ip);
        });
        return ipv6_result;
    }
}

/**
 * Util to convert to IPv6 to IPv4.
 * @param {String} ipv6 The IPv6 address.
 */
export function convertToIPv4(ipv6)
{
    const result = new Array();
    if (ipv6.includes(":")) {
        ipv6 = ipv6.split(":");

        // Indexes 6 and 7 should always
        // have the actual valid IP.
        let ip_hexadecimal = `${ipv6[6]}:${ipv6[7]}`;
        
        // We split it twice to be able to separate
        // into an array each hexadecimal digit.
        ip_hexadecimal = ip_hexadecimal.split(":");
        ip_hexadecimal.forEach((hex) => {
            let combined_hex = new Array();
            let target_hex = "";
            hex = hex.split("");
            combined_hex = hex;

            for (let i = 0; combined_hex.length > i; i += 2) {
                target_hex = combined_hex[i] + combined_hex[i + 1];
                result.push(convertFromHexToDecimal(target_hex));
            }
        });
        return result.join(".");
    } else {
        console.error(`The following IP ${ipv6} is not a valid IPv6.`);
        return -1;
    }
}

/**
 * Generates a random IPv4 address.
 * @param {Array | String} ip_range Must have at least 2 IP ranges, using | or - as a seperator.
 * @param {Boolean} [shuffle] Set to true for increased randomness.
 */
export function generateRandomIP(ip_range, shuffle = false) {
    // Use the pipe (|) or dash (-) as a special symbols to
    // create arrays within arrays.
    const IP_LENGTH = 4;
    const ip_array = convertIPRangeToArray(ip_range);
    const new_ip = new Array();
    let ip_num = 0;

    for (let i = 0; ip_array.length > i && IP_LENGTH !== new_ip.length; ++i) {
        for (let j = 0; ip_array[i].length > j; ++j) {
            // Determine if this individual IP is beyond 255
            // and silently set it to it.
            if (255 < ip_array[i][j]) {
                ip_array[i][j] = 255;
            } else if (255 < ip_array[i + 1][j]) {
                ip_array[i + 1][j] = 255;
            }

            // Take the IP from our current index
            // + 1, and use that as the maximum
            // value to generate each individual IP.
            // Otherwise, randomise the number itself.
            if (undefined != ip_array[i + 1][j]) {
                ip_num = randomNumberBetween(
                    parseInt(ip_array[i][j]),
                    parseInt(ip_array[i + 1][j])
                );
            } else {
                ip_num = randomNumberBetween(
                    parseInt(ip_array[i][j]),
                    parseInt(ip_array[i][j])
                );
            }
            new_ip.push(ip_num);
        }
    }

    // Increase randomness.
    if (shuffle) {
        new_ip.shuffle();
    }
    return new_ip.join(".");
}

/**
 * Generates a random IPv4 address but the address generated
 * almost always falls in the specified country.
 * @param {String} country
 * @param {Number} max_attemps Maximum retry attemps before failing.
 * @returns A random IPv4 address that's almost always located in the asked country.
 */
export async function generateRandomIPBasedOnCountry(country, max_attemps) {
    let current_ip = generateRandomIP("0.0.0.0 - 255.255.255.255");

    // Wrapper helper for the Address Lookup API.
    async function requestIPFromExternalAPI(with_ip) {
        try {
            const res = await window.fetch(`https://ipapi.co/${with_ip}/json/`);
            return await res.json();
        } catch (err) {
            return console.error(err);
        }
    }

    // Inner function that actually deals with
    // generating the IP.
    async function requestIP(attemps, target_country) {
        try {
            let result_ip;
            for (let i = 0; attemps > i; ++i) {
                result_ip = await requestIPFromExternalAPI(current_ip).then(
                    (res) => {
                        console.log(`Current IP: ${current_ip}`);

                        if (res.error) {
                            current_ip = generateRandomIP(
                                "0.0.0.0 - 255.255.255.255"
                            );
                            return;
                        } else if (res.country_name === target_country) {
                            current_ip = generateRandomIP(
                                `${res.ip} - ${current_ip}`
                            );
                            console.log(
                                `Success! Found a ${target_country} IP. New IP: ${current_ip}`
                            );
                            return current_ip;
                        } else {
                            current_ip = generateRandomIP(
                                "0.0.0.0 - 255.255.255.255"
                            );
                        }
                    }
                );

                // Break out of the loop if IPs for
                // the specified country were found.
                if (undefined != result_ip) break;
            }

            if (undefined == result_ip) {
                throw new Error(
                    `No IP were found for the country: ${target_country} at ${attemps} attemps.`
                );
            }
            return result_ip;
        } catch (err) {
            return (
                `No IP were found for the country: ${target_country}` &&
                console.error(err)
            );
        }
    }

    console.log(`Generating IP for country: ${country}`);
    return await requestIP(max_attemps, country);
}
