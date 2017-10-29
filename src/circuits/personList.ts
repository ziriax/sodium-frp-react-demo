import * as M from "../models"
import * as S from "sodiumjs"

import { Circuit } from "./circuit";
import { Person, MaybePerson } from "./person"

export type PersonArray = ReadonlyArray<Person>;

export class PersonList extends Circuit {
    public readonly add = new S.StreamSink<M.Person>();
    public readonly select = new S.StreamSink<Person>();
    public readonly persons: S.Cell<PersonArray>;
    public readonly selected: S.Cell<MaybePerson>;

    private constructor() {
        super("PersonList");
        
        const selected = new S.CellLoop<Person>();

        // Create a new person every time one needs to be added 
        const newPerson = this.add.map(model => Person.create(model, selected));
        
        // Accumulate newly added persons to the end of the list.
        const persons = newPerson.accum([], (person, persons: PersonArray) => [...persons, person]);

        // When an item is added, also select it.
        selected.loop(newPerson.orElse(this.select).hold(null as any));

        this.selected = selected;
        this.persons = persons;
    }

    public static create() {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new PersonList());
    }
}
