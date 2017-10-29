import * as H from "./helpers"

/** Helper functions to splice an immutable array */
export namespace Splice {
    export enum Kind {
        APPEND,
        REMOVE
    }

    export interface Action<T> {
        readonly kind: Kind;
        readonly item: T;
    }

    export function append<T>(item: T) {
        return { kind: Kind.APPEND, item };
    }

    export function remove<T>(item: T) {
        return { kind: Kind.REMOVE, item };
    }

    export function reduce<T>(action: Action<T>, items: ReadonlyArray<T>): ReadonlyArray<T> {
        switch (action.kind) {
            case Kind.APPEND:
                return items.concat(action.item);

            case Kind.REMOVE:
                return items.filter(item => item !== action.item);

            default:
                return H.assertNever(action.kind);
        }
    }

    export function selected<T>(action: Action<T>, items: ReadonlyArray<T>): T | null {
        switch (action.kind) {
            case Kind.APPEND:
                // When an item is added, select it
                return action.item;

            case Kind.REMOVE:
                // When an item is removed, select the next one
                const index = items.indexOf(action.item);
                if (index + 1 < items.length)
                    return items[index + 1];

                if (index - 1 >= 0)
                    return items[index - 1];

                return null;

            default:
                return H.assertNever(action.kind);
        }
    }
}

