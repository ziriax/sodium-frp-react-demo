import * as F from "sodium-frp-react"
import * as M from "../models"

/** Helper functions to splice an immutable array */
export namespace Splice {
    export interface Action<T> {
        readonly startIndex: number | ((items: ReadonlyArray<T>) => number);
        readonly deleteCount: number;
        readonly insertItems: ReadonlyArray<T>;
    }

    export function append<T>(...items: T[]): Action<T> {
        return { startIndex: ((items: ReadonlyArray<T>) => items.length), insertItems: items, deleteCount: 0 };
    }

    export function remove<T>(item: T): Action<T> {
        return { startIndex: ((items: ReadonlyArray<T>) => items.indexOf(item)), insertItems: [], deleteCount: 1 };
    }

    export function startIndexOf<T>(items: ReadonlyArray<T>, action: Action<T>): number {
        return typeof action.startIndex === "function" ? action.startIndex(items) : action.startIndex;
    }

    export function reduce<T>(action: Action<T>, items: ReadonlyArray<T>): ReadonlyArray<T> {
        const startIndex = startIndexOf(items, action);
        if (startIndex < 0)
            throw new Error("Item not found");

        return F.immutableSplice(items, startIndex, action.deleteCount, ...action.insertItems);
    }

    export function selected<T>(action: Action<T>, items: ReadonlyArray<T>): T | null {
        if (action.insertItems.length > 0) {
            // When items are added, select the last one.
            return action.insertItems[action.insertItems.length - 1];
        }

        if (action.deleteCount > 0) {
            // When items are removed, select the next one
            const startIndex = startIndexOf(items, action);
            const after = startIndex + action.deleteCount;
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

    /** Based on the identifiers, figure out what items need to be added, removed or updated */
    export function deltas<T>(source: ReadonlyArray<M.Identified<T>>, target: ReadonlyArray<M.Identified<T>>): ReadonlyArray<Action<T>> {
        const actions: Action<T>[] = [];
        return actions;
    }
}

