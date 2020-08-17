interface StringConstructor {
    random(length?: number, range?: number): string;
}
String.random = function (
    bytes: number = 8, range: number = 36, seperator = ''
): string {
    if (range > 36) {
        throw new Error('range > 36');
    }
    if (range < 2) {
        throw new Error('range < 2');
    }
    const numbers = new Uint8Array(
        bytes
    );
    window.crypto.getRandomValues(
        numbers
    );
    const strings = Array.from(
        numbers, padded(range)(max_length_per_byte(range))
    );
    return strings.join(seperator);
};
function padded(range: number) {
    return function (length: number) {
        return function (number: number) {
            const string = number.toString(range);
            return '0'.repeat(length - string.length) + string;
        }
    }
}
function max_length_per_byte(range: number) {
    switch (range) {
        case 36:
        case 35:
        case 34:
        case 33:
        case 32:
        case 31:
        case 30:
        case 29:
        case 28:
        case 27:
        case 26:
        case 25:
        case 24:
        case 23:
        case 22:
        case 21:
        case 19:
        case 18:
        case 17:
        case 16:
            return 2;
        case 15:
        case 14:
        case 13:
        case 12:
        case 11:
        case 10:
        case 9:
        case 8:
        case 7:
            return 3;
        case 6:
        case 5:
        case 4:
            return 4;
        case 3:
            return 6;
        case 2:
            return 8;
    }
    return 1;
}
