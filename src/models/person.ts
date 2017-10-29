export interface Person {
    readonly firstName: string;
    readonly lastName: string;
}

export namespace Person {
    export const empty:Person = {firstName:"", lastName:""};
}