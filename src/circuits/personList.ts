import * as M from "../models"
import * as S from "sodiumjs"
import * as F from "sodium-frp-react"

import { Splice } from "./splice"
import { Person, MaybePerson } from "./person"

export type PersonArray = ReadonlyArray<Person>;

// TODO: This should become a generic list, with a selection and add/remove/move-up/move-down/clear functionality
export class PersonList {
    public readonly add = new S.StreamSink<M.Identified<M.Person>>();
    public readonly remove = new S.StreamSink<S.Unit>();
    public readonly select = new S.StreamSink<Person>();
    
    public readonly persons: S.Cell<PersonArray>;
    public readonly selected: S.Cell<MaybePerson>;
    public readonly canRemove: S.Cell<boolean>;
    
    public readonly serializable: S.Cell<M.PersonList>;

    private constructor(loaded: S.Stream<M.PersonList>) {
        const selected = new S.CellLoop<MaybePerson>();

        // Create a new person every time one needs to be added 
        // When the persons are loaded, try to update the created person.
        // We could also just create a completely new list of persons of course, but that would be less incremental.
        const newPersons = this.add.map(model => {
            const newLoaded = loaded.map(list => list.persons.find(m => m.id === model.id)).filter(F.isDefined).map(m => m!.data);
            const newPerson = Person.create(model, selected, newLoaded);
            return newPerson;
        });

        // Accumulate the splices into a persons array
        const appends = newPersons.map(p => Splice.append(p));
        const removes = this.remove.snapshot1(selected).filter(F.isDottable).map(person => Splice.remove(person!));
        const splices = appends.orElse(removes);
        const persons = splices.accum<PersonArray>([], Splice.reduce);

        // Compute the next selection
        const selects = splices.snapshot(persons, Splice.selected).orElse(this.select).hold(null);
        selected.loop(selects);

        const canRemove = selected.map(p => p !== null);
        
        // Expose serializable data.
        const serializablePersons = S.Cell.switchC(persons.map(ps => F.flattenCells(ps.map(p => p.serializable))));
        const serializable = serializablePersons.lift(selected, (persons, s) => ({ persons, selectedId: s ? s.modelId : 0 }));

        // TODO: Handle loaded events
        loaded.listen(console.warn);

        this.canRemove = canRemove;
        this.selected = selected;
        this.persons = persons;
        this.serializable = serializable;
    }

    public static create(loaded: S.Stream<M.PersonList>) {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new PersonList(loaded));
    }
}
