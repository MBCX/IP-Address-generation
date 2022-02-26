import { randomNumberBetween } from "./utils.js";

/**
 * Generates a random IPv4 address.
 * @param {Array | String} ip_range Must have at least 2 IP ranges, using | or - as a seperator.
 * @param {Boolean} shuffle Set to true for increased randomness.
 */
export function generateRandomIP(ip_range, shuffle = false) {
    // Use the pipe (|) or dash (-) as a special symbols to
    // create arrays within arrays.
    const IP_LENGTH = 4;
    if (ip_range.includes("|") || ip_range.includes("-")) {
        const splitted_ip = new Array();
        const new_ip = new Array();
        if (ip_range.includes("|")) {
            ip_range = ip_range.split("|");
        } else if (ip_range.includes("-")) {
            ip_range = ip_range.split("-");
        }

        // With the now split IP ranges, split
        // each individual IP to a individual array.
        ip_range.forEach((individual_ip) => {
            if (individual_ip.includes(".")) {
                splitted_ip.push(individual_ip.split("."));
            }
        });
        ip_range = splitted_ip;
        let ip_num = 0;

        for (
            let i = 0;
            ip_range.length > i && IP_LENGTH !== new_ip.length;
            ++i
        ) {
            for (let j = 0; ip_range[i].length > j; ++j) {
                // Determine if this individual IP is beyond 255
                // and silently set it to it.
                if (255 < ip_range[i][j]) {
                    ip_range[i][j] = 255;
                } else if (255 < ip_range[i + 1][j]) {
                    ip_range[i + 1][j] = 255;
                }

                // Take the IP from our current index
                // + 1, and use that as the maximum
                // value to generate each individual IP.
                // Otherwise, randomise the number itself.
                if (undefined != ip_range[i + 1][j]) {
                    ip_num = randomNumberBetween(
                        parseInt(ip_range[i][j]),
                        parseInt(ip_range[i + 1][j])
                    );
                } else {
                    ip_num = randomNumberBetween(
                        parseInt(ip_range[i][j]),
                        parseInt(ip_range[i][j])
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
    } else {
        console.error(
            `generateRandomIP: Specified input ${ip_range} is not a valid input. Must have at least 2 ranges, and use | as a seperator.`
        );
        return -1;
    }
}

/**
 * Generates a random IPv4 address but the address generated
 * always* falls in the specified country.
 * @param {String} country 
 * @param {Number} max_attemps Maximum retry attemps before failing.
 * @returns A random IPv4 address that's always located in the asked country.
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
                result_ip = await requestIPFromExternalAPI(current_ip).then((res) => {
                    console.log(`Current IP: ${current_ip}`);

                    if (res.error) {
                        current_ip = generateRandomIP("0.0.0.0 - 255.255.255.255");
                        return;
                    }
                    if (res.country_name === target_country) {
                        current_ip = generateRandomIP(`${res.ip} - ${current_ip}`);
                        console.log(
                            `Success! Found a ${target_country} IP. New IP: ${current_ip}`
                        );
                        return current_ip;
                    } else {
                        current_ip = generateRandomIP("0.0.0.0 - 255.255.255.255");
                    }
                });

                // Break out of the loop if IPs for 
                // the specified country were found.
                if (undefined != result_ip) break;
            }

            if (undefined == result_ip) {
                throw new Error(`No IP were found for the country: ${target_country} at ${attemps} attemps.`);
            }
            return result_ip;
        } catch (err) {
            return `No IP were found for the country: ${target_country}` && console.error(err);
        }
    }

    console.log(`Generating IP for country: ${country}`);
    return await requestIP(max_attemps, country);
}
