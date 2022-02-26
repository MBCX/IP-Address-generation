export const COUNTRY = {
    US: "United States",
    GB: "United Kigndom",
    NONE: -1,
};

export const STATE = {
    US: {
        NEW_YORK: "New York",
        NEW_JERSEY: "New Jersey",
    },
    GB: {
        ENGLAND: "England",
    },
    NONE: -1,
};

export function randomNumberBetween(min, max) {
    if (min === max || max === min) return min;

    if (min > max) {
        min = min ^ max ^ (max = min);
    }
    return Math.floor(Math.random() * (max - min) + min);

    // if (min < max) {
    //     while (min >= result) {
    //         result = Math.floor(Math.random() * (max - min) + min);
    //     }
    // } else {
    //     while (max >= result) {
    //         result = Math.floor(Math.random() * (min + max) - max);
    //     }
    // }
}

export function convertToHex(number) {
    // Convert from string to number.
    number = Number(number);
    const hexadecimal_alphabet = {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
    };

    // Just change the numbers for anything
    // less than 15.
    if (15 > number) {
        if (10 < number) {
            switch (number) {
                case 10:
                    return hexadecimal_alphabet.a;
                case 11:
                    return hexadecimal_alphabet.b;
                case 12:
                    return hexadecimal_alphabet.c;
                case 13:
                    return hexadecimal_alphabet.d;
                case 14:
                    return hexadecimal_alphabet.e;
                case 15:
                    return hexadecimal_alphabet.f;
            }       
        }
        return number;
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
                // not the last division (setting the)
                // number to 1.
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
        return result.reverse();
    }
}
