/// <reference types="jest" />

import { Splice } from "./splice"

describe("reduce", () => {

    describe("append", () => {
        test('1 to []', () => {
            expect(Splice.reduce(Splice.append(1), [])).toMatchObject([1]);
        });

        test('2 to [1]', () => {
            expect(Splice.reduce(Splice.append(2), [1])).toMatchObject([1, 2]);
        });

        test('[1,2] to []', () => {
            expect(Splice.reduce(Splice.append(1, 2), [])).toMatchObject([1, 2]);
        });

        test('2,3] to [1]', () => {
            expect(Splice.reduce(Splice.append(2, 3), [1])).toMatchObject([1, 2, 3]);
        });
    });

    describe("remove", () => {
        test('1 from []', () => {
            expect(() => Splice.reduce(Splice.remove(1), [])).toThrowError();
        });

        test('1 from [1]', () => {
            expect(Splice.reduce(Splice.remove(1), [1])).toMatchObject([]);
        });

        test('1 from [1,2]', () => {
            expect(Splice.reduce(Splice.remove(1), [1, 2])).toMatchObject([2]);
        });

        test('2 from [1,2]', () => {
            expect(Splice.reduce(Splice.remove(2), [1, 2])).toMatchObject([1]);
        });
    });

    describe("replace", () => {
        test('[] by []', () => {
            const items = [];
            expect(Splice.reduce(Splice.replace([]), items)).toBe(items);
        });

        test('[1] by [1]', () => {
            const items = [1];
            expect(Splice.reduce(Splice.replace([1]), items)).toBe(items);
        });

        test('[1] by [1,2]', () => {
            const items = [1];
            expect(Splice.reduce(Splice.replace([1,2]), items)).not.toBe(items);
        });
    });
});

describe("selected", () => {
    describe("append", () => {
        test('1 to []', () => {
            expect(Splice.selected(Splice.append(1), [])).toBe(1);
        });

        test('2 to [1]', () => {
            expect(Splice.selected(Splice.append(2), [1])).toBe(2);
        });

        test('[1,2] to []', () => {
            expect(Splice.selected(Splice.append(1, 2), [])).toBe(2);
        });

        test('2,3] to [1]', () => {
            expect(Splice.selected(Splice.append(2, 3), [1])).toBe(3);
        });
    });

    describe("remove", () => {
        test('1 from [1]', () => {
            expect(Splice.selected(Splice.remove(1), [1])).toBeNull();
        });

        test('1 from [1,2]', () => {
            expect(Splice.selected(Splice.remove(1), [1, 2])).toBe(2);
        });

        test('2 from [1,2]', () => {
            expect(Splice.selected(Splice.remove(2), [1, 2])).toBe(1);
        });
    });
});

