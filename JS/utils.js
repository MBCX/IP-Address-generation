export const IP_COUNTRY_AND_CITY = {
    COUNTRY: {
        US: 0,
        NONE: -1,
    },
    CITY: {
        US: {
            TEXAS: 0,
            NEW_YORK: 1,
        },
        NONE: -1,
    }
}

export function randomNumberBetween(min, max) {
    let result = 0;
    if (min == max || max == min) return min;
    
    if (min < max) {
        while (min >= result) {
            result = Math.floor(Math.random() * (max - min) + min);
        }
    } else {
        while (max >= result) {
            result = Math.floor(Math.random() * (min + max) - max);
        }
    }
    return result;
}

/**
 * A function that generates a fake IP address.
 * @param {Array | String} ip_range Must be at least 2 range, using | as a seperator.
 * @param {Boolean} shuffle Set to true for more randomness.
 */
export function generateIP(ip_range, shuffle = false) {
    // Use the pipe (|) as a special symbol to
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

        ip_range.forEach((individual_ip) => {
            if (individual_ip.includes(".")) {
                splitted_ip.push(individual_ip.split("."));
            }
        });
        ip_range = splitted_ip;
        let ip_num = 0;

        for (let i = 0; (ip_range.length > i) && (IP_LENGTH !== new_ip.length); ++i) {
            for (let j = 0; ip_range[i].length > j; ++j) {
                // Determine if this individual IP is beyond 255.
                if (255 < ip_range[i][j]) {
                    ip_range[i][j] = 255;
                } else if (255 < ip_range[i + 1][j]) {
                    ip_range[i + 1][j] = 255;
                }

                // Generate IPs based on range.
                if (undefined != ip_range[i + 1][j]) {
                    ip_num = randomNumberBetween(parseInt(ip_range[i][j]), parseInt(ip_range[i + 1][j]));
                } else {
                    ip_num = randomNumberBetween(parseInt(ip_range[i][j]), parseInt(ip_range[i][j]));
                }
                new_ip.push(ip_num);
            }
        }
        return new_ip;
    } else {
        console.error(`generateIP: Specified input ${ip_range} is not a valid input. Must have at least 2 ranges, and use | as a seperator.`);
        return 0;
    }
}


export function getRandomIPBasedOn(country, city = IP_COUNTRY_AND_CITY.CITY.NONE) {
    switch (country) {
        case IP_COUNTRY_AND_CITY.COUNTRY.US:

            break;
        
        case IP_COUNTRY_AND_CITY.COUNTRY.NONE:
        default:
            console.warn("No country specified. Generating random IP from 0.0 to 255.255.");
            return generateIP("0.0.0.0-255.255.255.255");
    }
}
