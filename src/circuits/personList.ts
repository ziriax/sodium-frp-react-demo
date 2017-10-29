import * as M from "../models"
import * as S from "sodiumjs"

import { Splice } from "./splice"
import { Circuit } from "./circuit";
import { Person, MaybePerson } from "./person"

export type PersonArray = ReadonlyArray<Person>;

// TODO: This should become a generic list, with a selection and add/remove/move-up/move-down/clear/undo/redo functionality
export class PersonList extends Circuit {
    public readonly add = new S.StreamSink<M.Person>();
    public readonly remove = new S.StreamSink<S.Unit>();
    public readonly select = new S.StreamSink<Person>();
    public readonly persons: S.Cell<PersonArray>;
    public readonly selected: S.Cell<MaybePerson>;

    private constructor() {
        super("PersonList");

        const selected = new S.CellLoop<Person>();

        // Create a new person every time one needs to be added 
        const newPersons = this.add.map(model => Person.create(model, selected));

        // Accumulate the splices into a persons array
        const appends = newPersons.map(Splice.append);
        const removes = this.remove.snapshot(selected, (_, person) => Splice.remove(person));
        const splices = appends.orElse(removes);
        const persons = splices.accum([], Splice.reduce);

        // Compute the next selection
        const selects = splices.snapshot(persons, Splice.selected).orElse(this.select).hold(null);
        selected.loop(selects);

        this.selected = selected;
        this.persons = persons;
    }

    public static create() {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new PersonList());
    }
}
