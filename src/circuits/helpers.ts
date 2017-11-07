import * as S from "sodiumjs"

export namespace Array {
    export function withoutNulls<T>(items: ReadonlyArray<T | null>): ReadonlyArray<T> {
        return items.filter(x => x !== null) as any;
    }

    export function shallowEquals<T>(items1: ReadonlyArray<T>, items2: ReadonlyArray<T>): boolean {
        return items1.length === items2.length && items1.every((item, index) => items2[index] === item);
    }
}

export namespace Stream {
    export function withoutNulls<T>(items: S.Stream<T | null>): S.Stream<T> {
        return items.filter(x => x !== null) as any;
    }
}

