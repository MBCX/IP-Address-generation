export const COUNTRY = {
    US: 0,
    GB: 1,
    NONE: -1,
};

export const STATE = {
    US: {
        NEW_YORK: 0,
    },
    GB: {
        ENGLAND: 0,
    },
    NONE: -1,
};

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

        for (
            let i = 0;
            ip_range.length > i && IP_LENGTH !== new_ip.length;
            ++i
        ) {
            for (let j = 0; ip_range[i].length > j; ++j) {
                // Determine if this individual IP is beyond 255.
                if (255 < ip_range[i][j]) {
                    ip_range[i][j] = 255;
                } else if (255 < ip_range[i + 1][j]) {
                    ip_range[i + 1][j] = 255;
                }

                // Generate IPs based on range.
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
        return new_ip.join(".");
    } else {
        console.error(
            `generateIP: Specified input ${ip_range} is not a valid input. Must have at least 2 ranges, and use | as a seperator.`
        );
        return 0;
    }
}

function translateCountry(country) {
    switch (country) {
        case COUNTRY.US:
            return "United States";

        case COUNTRY.GB:
            return "Great Britan (United Kingdom)";
    }
}

export function getRandomIPBasedOnCountry(country, state = STATE.NONE) {
    let ip_amount_request = 0;
    let current_ip = generateIP("0.0.0.0-255.255.255.255");
    async function makeIPRequest(with_ip) {
        try {
            const res = await window.fetch(
                `https://rdap.arin.net/registry/ip/${with_ip}`
            );
            return await res.json();
        } catch (err) {
            return console.error(err);
        }
    }

    function getCountryCode(country) {
        switch (country) {
            case COUNTRY.US:
                return "US";
            case COUNTRY.GB:
                return "GB";
            default:
                return `${country}, unknown.`;
        }
    }

    function getStateCode(st) {
        switch (st) {
            case STATE.US.NEW_YORK:
                return "New York";
            case STATE.GB.ENGLAND:
                return "England";
        }
    }

    async function requestIP(max_attemps, target_country) {
        try {
            makeIPRequest("13.71.253.139")
                .then((res) => {
                    console.log(`Current IP: ${current_ip}`);
                    const long_label_desc = res.entities[0].vcardArray[1][2][1].label.split('\\n');
    
                    if (
                        res.country === getCountryCode(target_country) ||
                        -1 !== long_label_desc[0].indexOf(`${translateCountry(country)}`)
                    ) {
                        current_ip = generateIP(
                            `${res.startAddress} - ${res.endAddress}`
                        );
                        console.log(
                            `Success! Found a ${translateCountry(country)} IP. New IP: ${current_ip}`
                        );

                        // Save this on local storage for more performant
                        // search.
                        window.localStorage.setItem(`${translateCountry(country)} IPs range`, `${res.startAddress} - ${res.endAddress}`);

                        return current_ip;
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    ip_amount_request++;
    
                    if (max_attemps < ip_amount_request) {
                        throw Error(
                            `Over ${ip_amount_request} were made, and no results.`
                        );
                    } else {
                        current_ip = generateIP("0.0.0.0-255.255.255.255");
                        requestIP(max_attemps, target_country);
                    }
                });
        } catch (err) {
            return console.error(err);
        }
    }

    console.log(`Generating IP for country: ${translateCountry(country)}`);
    
    return new Promise((resolve, reject) => {
        switch (country) {
            case COUNTRY.US: {
                switch (state) {
                    case STATE.US.NEW_YORK:
                        requestIP(10, country).then((res) => resolve(res));
                        break;
                    default:
                        console.warn(
                            `No state specified for ${country}. Generating a random US-based IP.`
                        );
    
                        break;
                }
    
                break;
            }
            case COUNTRY.NONE:
            default:
                console.warn(
                    "No country specified. Generating random IP from 0.0 to 255.255."
                );
                return generateIP("0.0.0.0-255.255.255.255");
        }
    });
}
