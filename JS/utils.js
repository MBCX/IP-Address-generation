export const COUNTRY = {
    US: "United States",
    GB: "United Kigndom",
    NONE: -1,
};

export const STATE = {
    US: {
        NEW_YORK: "New York",
        NEW_JERSEY: "New Jersey"
    },
    GB: {
        ENGLAND: "England",
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
