export function randomNumberBetween(min, max) {
    if (min === max || max === min) return min;
    if (min > max) {
        // Trick to swap values between 2 variables
        // without using an intermediate variable.
        min = min ^ max ^ (max = min);
    }
    return Math.floor(Math.random() * (max - min) + min);
}

function getHexAlphabetValue(hex_alphabet) {
    switch (hex_alphabet) {
        case "a":
        case "A":
            return 10;
        case "b":
        case "B":
            return 11;
        case "c":
        case "C":
            return 12;
        case "d":
        case "D":
            return 13;
        case "e":
        case "E":
            return 14;
        case "f":
        case "F":
            return 15;
    }
}

/**
 * Util to convert a hexadecimal number
 * to the decimal numbering system.
 * @param {String} hex Hexadecimal number.
 */
export function convertFromHexToDecimal(hex) {
    const hex_array = hex.split("");
    const hex_length = hex_array.length;
    let result = 0;

    for (let i = 0; hex_length > i; i++) {
        let number = 0;
        if (/[a-fA-F]/i.test(hex_array[i])) {
            number = getHexAlphabetValue(hex_array[i]);
        } else {
            number = parseInt(hex_array[i]);
        }
        result += number * Math.pow(16, hex_length - (i + 1));
    }
    return result;
}

/**
 * Converts a number to the hexadecimal numbering system.
 * @param {Number} number Number to convert to hexadecimal.
 * @param {Boolean} [capitalise] CAPITALISE the hexadecimal letters?
 * @returns The hexadecimal representation of the given number.
 */
export function convertFromDecimalToHex(number, capitalise = false) {
    // Convert from string to number.
    number = Number(number);
    const hexadecimal_alphabet = {
        a: (capitalise) ? "A" : "a",
        b: (capitalise) ? "B" : "b",
        c: (capitalise) ? "C" : "c",
        d: (capitalise) ? "D" : "d",
        e: (capitalise) ? "E" : "e",
        f: (capitalise) ? "F" : "f",
    };

    if (15 >= number) {
        // This prefix eliminates the issue
        // of hex numbers being combined.
        // i.e, cc insted of 0c0c.
        const prefix = "0";
        if (10 <= number) {
            switch (number) {
                case 10:
                    return prefix + hexadecimal_alphabet.a;
                case 11:
                    return prefix + hexadecimal_alphabet.b;
                case 12:
                    return prefix + hexadecimal_alphabet.c;
                case 13:
                    return prefix + hexadecimal_alphabet.d;
                case 14:
                    return prefix + hexadecimal_alphabet.e;
                case 15:
                    return prefix + hexadecimal_alphabet.f;
            }
        }
        return prefix + number;
    } else {
        let is_last_division = false;
        let result = "";

        while (0 < number) {
            let last_number_value = 0;
            let decimal_point_result = 0;
            number = number / 16;

            // Only do the following if the division
            // result has decimal points.
            if (!Number.isInteger(number)) {
                last_number_value = Math.floor(number);
                decimal_point_result = Number(
                    "0." + number.toString().split(".")[1]
                );
                decimal_point_result *= 16;
            } else {
                decimal_point_result = number;
                result += "0";
            }

            // Set to correct letter.
            if (decimal_point_result > 9) {
                switch (decimal_point_result) {
                    case 10:
                        result += hexadecimal_alphabet.a;
                        break;
                    case 11:
                        result += hexadecimal_alphabet.b;
                        break;
                    case 12:
                        result += hexadecimal_alphabet.c;
                        break;
                    case 13:
                        result += hexadecimal_alphabet.d;
                        break;
                    case 14:
                        result += hexadecimal_alphabet.e;
                        break;
                    case 15:
                        result += hexadecimal_alphabet.f;
                        break;
                }
            } else {
                // Add to the result as long as it's
                // not the last division check.
                if (!is_last_division) {
                    result += decimal_point_result;
                }
            }
            number = last_number_value;

            if (0 === number && !is_last_division) {
                is_last_division = true;
                number = 1;
            }
        }

        // Reverse the hexadecimal result
        // for better accuracy.
        return result.reverse();
    }
}
