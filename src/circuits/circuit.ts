
export class Circuit {
    private static lastId = 0;

    public readonly id: string;

    constructor(type: string) {
        this.id = type + '#' + (++Circuit.lastId).toString(36);
    }

    toString() {
        return this.id;
    }

    public static getId(c: Circuit) {
        return c.id;
    }
}
