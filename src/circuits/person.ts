import * as M from "../models"
import * as S from "sodiumjs"
import { Circuit } from "./circuit";

export type MaybePerson = Person | null;

export class Person extends Circuit {

    public readonly firstName: S.CellSink<string>;
    public readonly lastName: S.CellSink<string>;
    public readonly fullName: S.Cell<string>;
    public readonly isSelected: S.Cell<boolean>;

    private constructor(model: M.Person, selected: S.Cell<MaybePerson>) {
        super("Person");
        this.firstName = new S.CellSink(model.firstName);
        this.lastName = new S.CellSink(model.lastName);
        this.fullName = this.firstName.lift(this.lastName, (fn, ln) => fn.length || ln.length ? `${fn} ${ln}` : "<incognito>");
        this.isSelected = selected.map(p => p === this);
    }

    public static create(model: M.Person, selected: S.Cell<MaybePerson>) {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new Person(model, selected));
    }
}

