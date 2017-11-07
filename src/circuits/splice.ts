import * as F from "sodium-frp-react"
import * as M from "../models"
import * as H from "./helpers"

/** Helper functions to splice an immutable array */
export namespace Splice {
    export type ArrayNumberProvider<T> = number | ((items: ReadonlyArray<T>) => number);

    export interface Action<T> {
        readonly startIndex: ArrayNumberProvider<T>;
        readonly deleteCount: ArrayNumberProvider<T>;
        readonly insertItems: ReadonlyArray<T>;
    }

    export interface NumericAction<T> {
        readonly startIndex: number;
        readonly deleteCount: number;
        readonly insertItems: ReadonlyArray<T>;
    }

    export function append<T>(...items: T[]): Action<T> {
        return { startIndex: ((items: ReadonlyArray<T>) => items.length), insertItems: items, deleteCount: 0 };
    }

    export function remove<T>(item: T): Action<T> {
        return { startIndex: ((items: ReadonlyArray<T>) => items.indexOf(item)), insertItems: [], deleteCount: 1 };
    }

    export function replace<T>(insertItems: ReadonlyArray<T>): Action<T> {
        return { startIndex: 0, deleteCount: items => items.length, insertItems };
    }

    export function getArrayNumber<T>(items: ReadonlyArray<T>, provider: ArrayNumberProvider<T>): number {
        return typeof provider === "function" ? provider(items) : provider;
    }

    export function toNumericAction<T>(action: Action<T>, items: ReadonlyArray<T>): NumericAction<T> {
        const startIndex = getArrayNumber(items, action.startIndex);
        if (startIndex < 0 || startIndex > items.length)
            throw new Error(`${startIndex} is not a valid splice starting index`);

        const deleteCount = getArrayNumber(items, action.deleteCount);
        if (deleteCount < 0 || deleteCount > items.length)
            throw new Error(`${deleteCount} is not a valid splice delete count`);

        const insertItems = action.insertItems;

        return { startIndex, deleteCount, insertItems };
    }

    export function reduce<T>(action: Action<T>, items: ReadonlyArray<T>): ReadonlyArray<T> {
        const { startIndex, deleteCount, insertItems } = toNumericAction(action, items);

        // If the array is completely replaced by the same array, just return the previous array, to get better incremental updates (reselect-like stuff)
        return startIndex === 0 && deleteCount === items.length && H.Array.shallowEquals(items, action.insertItems)
            ? items
            : F.immutableSplice(items, startIndex, deleteCount, ...action.insertItems);
    }

    export function selected<T>(action: Action<T>, items: ReadonlyArray<T>): T | null {
        if (action.insertItems.length > 0) {
            // When items are added, select the last one.
            return action.insertItems[action.insertItems.length - 1];
        }

        // When items are removed, select the next one
        const { startIndex, deleteCount } = toNumericAction(action, items);
        if (deleteCount > 0) {
            const after = startIndex + deleteCount;
            const before = startIndex - 1;
            return after < items.length
                ? items[after]
                : before >= 0
                    ? items[before]
                    : null;
        }

        // By default select the last item
        return items.length > 0 ? items[items.length - 1] : null;
    }
}

