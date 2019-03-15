export class AssertException {
    constructor(message?: string) {
        this.message = message;
    }

    toString() {
        return 'AssertException: ' + this.message;
    }

    private message: string;
}

export function assert(expression: any, message?: string) {
    if (!expression) {
        throw new AssertException(message);
    }
    return expression;
}

export default assert;
