import {
    randomNumberBetween,
    convertFromDecimalToHex,
    convertFromHexToDecimal
} from "./utils.js";

/**
 * Splits a given IP range into an array. The IPs must be splitted
 * either by a | or a - character. Returns -1 otherwhise.
 * @param {String} ip IP range.
 * @returns An array from the splitted IP range.
 */
export function convertIPRangeToArray(ip) {
    const final_ip_array = new Array();
    if ((ip = splitIPRangeToArray(ip))) {
        // With the now split IP ranges, split
        // each individual IP to a individual array.
        ip.forEach((individual_ip) => {
            // Assume each valid IPv4 address
            // contains a '.'
            final_ip_array.push(splitIPv4dots(individual_ip));
        });
        return final_ip_array;
    } else {
        console.error(`The following IP: ${ip} is not splitted with | or -.`);
        return -1;
    }
}

/**
 * Splits the . found in an valid IPv4 address.
 * @param {String} ip
 */
function splitIPv4dots(ip) {
    return ip.split(".");
}

/**
 * Splits the given IPv4 range into an array.
 * The range must have a | or - as separators.
 * @param {String} ipv4_range
 */
function splitIPRangeToArray(ipv4_range) {
    if (ipv4_range.includes("|")) {
        return (ipv4_range = ipv4_range.split("|"));
    } else if (ipv4_range.includes("-")) {
        return (ipv4_range = ipv4_range.split("-"));
    }

    // This return means as a cheap
    // error handling.
    return false;
}

/**
 * Util to convert IPv4 to IPv6.
 * @param {(String | Number[])} ipv4 The IPv4 address.
 * @param {Boolean} [capitalise] CAPITALISE the hexadecimal letters?
 */
export function convertToIPv6(ipv4, capitalise = false) {
    const ipv6_prefix = (capitalise) ? "0:0:0:0:0:FFFF:" : "0:0:0:0:0:ffff:";
    let ipv6_result = ipv6_prefix;

    // Check if we have to deal with multiple IPv4s.
    if (Array.isArray(ipv4) || ipv4.includes("|") || ipv4.includes("-")) {
        ipv4 = splitIPRangeToArray(ipv4);
        const result_ips = new Array();
        const current_hex_ip = new Array();

        ipv4.forEach((ip) => {
            const ip_splitted = splitIPv4dots(ip);

            // Resets hex conversions for the next ip.
            current_hex_ip.length = 0;
            ip_splitted.forEach((ip_number, i) => {
                if (2 === i % 3) {
                    current_hex_ip[current_hex_ip.length - 1] += ":";
                }
                current_hex_ip.push(convertFromDecimalToHex(ip_number, capitalise));
            });

            result_ips.push(ipv6_prefix + current_hex_ip.join(""));
        });
        return result_ips;
    } else {
        const ip_splitted = splitIPv4dots(ipv4);
        ip_splitted.forEach((ip, i) => {
            if (2 === i % 3) {
                ipv6_result += ":";
            }
            ipv6_result += convertFromDecimalToHex(ip, capitalise);
        });
        return ipv6_result;
    }
}

/**
 * Util to convert to IPv6 to IPv4.
 * @param {String} ipv6 The IPv6 address.
 */
export function convertToIPv4(ipv6) {
    const result = new Array();
    
    if (ipv6.includes(":")) {
        ipv6 = ipv6.split(":");

        // These indexes must start with 0 in order to be
        // a valid IPv6 address to convert to. Otherwise
        // it may not be.
        if (!"0:".includes(ipv6[0]) && !"0:".includes(ipv6[1])) {
            return -1;
        }

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
 * Generates a random IPv6 address.
 * @param {Boolean} fully_random Do you want the IP to be completly random (even if it's not a valid address)?
 * @param {Boolean} [capitalise] CAPITALISE the hexadecimal letters?
 * @param {Boolean} [shuffle] Set to true for increased randomness.
 */
export function generateRandomIPv6(fully_random, capitalise = false, shuffle = false) {
    const template = "0000:0000:0000:0000:0000:0000:0000:0000";
    let result;

    if (fully_random) {
        if (capitalise) {
            result = template.replace(/0/g, () => {
                return "0123456789ABCDEF".charAt(Math.floor(16 * Math.random()));
            });
        } else {
            result = template.replace(/0/g, () => {
                return "0123456789abcdef".charAt(Math.floor(16 * Math.random()));
            });
        }
    } else {
        const ipv4 = generateRandomIPv4("0.0.0.0 - 255.255.255.255", shuffle);
        result = convertToIPv6(ipv4, capitalise);
    }

    return result;
}

/**
 * Generates a random IPv4 address.
 * @param {String} ip_range Must have at least 2 IP ranges, using | or - as a seperator.
 * @param {Boolean} [shuffle] Set to true for increased randomness.
 */
export function generateRandomIPv4(ip_range, shuffle = false) {
    const IP_LENGTH = 4;
    const ip_array = convertIPRangeToArray(ip_range);
    const new_ip = new Array();
    let ip_num = 0;

    for (let i = 0; ip_array.length > i && IP_LENGTH !== new_ip.length; ++i) {
        for (let j = 0; ip_array[i].length > j; ++j) {
            // Determine if this individual IP is beyond 255
            // and silently set it.
            if (255 < ip_array[i][j]) {
                ip_array[i][j] = 255;
            } else if (255 < ip_array[i + 1][j]) {
                ip_array[i + 1][j] = 255;
            }

            // Use the next IP number from our index + 1
            // to be the maximum number to randomise.
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
 * @returns A random IPv4 address that's almost always located in the asked country. Returns undefined at error.
 */
export async function generateRandomIPv4BasedOnCountry(country, max_attemps) {
    let current_ip = generateRandomIPv4("0.0.0.0 - 255.255.255.255");

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
                            current_ip = generateRandomIPv4(
                                "0.0.0.0 - 255.255.255.255"
                            );
                            return;
                        } else if (res.country_name === target_country) {
                            current_ip = generateRandomIPv4(
                                `${res.ip} - ${current_ip}`
                            );
                            console.log(
                                `Success! Found a ${target_country} IP. New IP: ${current_ip}`
                            );
                            return current_ip;
                        } else {
                            current_ip = generateRandomIPv4(
                                "0.0.0.0 - 255.255.255.255"
                            );
                        }
                    }
                );

                // Break out of the loop if IPs for
                // the specified country were found.
                if (undefined != result_ip) return result_ip;
            }

            throw new Error(
                `No IP were found for the country: ${target_country} at ${attemps} attemps.`
            );
        } catch (err) {
            console.error(err);
        }
    }

    console.log(`Generating IP for country: ${country}`);
    return await requestIP(max_attemps, country);
}
