import * as F from "sodium-frp-react"

export interface Person {
    readonly firstName: string;
    readonly lastName: string;
}

export namespace Person {
    export const empty: Person = { firstName: "", lastName: "" };

    export const keys = F.keysOf(empty);
}
