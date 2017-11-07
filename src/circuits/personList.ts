import * as M from "../models"
import * as S from "sodiumjs"
import * as F from "sodium-frp-react"
import * as H from "./helpers"

import { Splice } from "./splice"
import { Person$, MaybePerson$ } from "./person"

export type PersonArray$ = ReadonlyArray<Person$>;

/** Maps the person-id to the person-index in the list  */
type IdToIndexMap = number[];

function mapIdToIndex<T>(items: ReadonlyArray<T>, getId: (item: T) => M.Identifier): IdToIndexMap {
    return items.reduce<IdToIndexMap>((acc, p, index) => (acc[getId(p)] = index, acc), []);
}

// TODO: This should become a generic list, with a selection and add/remove/move-up/move-down/clear functionality
export class PersonList$ {
    public readonly add$ = new S.StreamSink<M.Identified<M.Person>>();
    public readonly remove$ = new S.StreamSink<S.Unit>();
    public readonly select$ = new S.StreamSink<Person$>();

    public readonly persons$: S.Cell<PersonArray$>;
    public readonly selected$: S.Cell<MaybePerson$>;
    public readonly canRemove$: S.Cell<boolean>;

    public readonly state$: S.Cell<M.PersonList>;

    private constructor(loaded$: S.Stream<M.PersonList>) {
        const selected$ = new S.CellLoop<MaybePerson$>();
        const persons$ = new S.CellLoop<PersonArray$>();

        const personsTable$ = persons$.map(ps$ => ({ persons$: ps$, indexMap: mapIdToIndex(ps$, p => p.modelId) }));
        const loadedTable$ = loaded$.map(ps => ({ ...ps, indexMap: mapIdToIndex(ps.persons, p => p.id) }));

        // Creates a new person circuit. 
        const createPerson$ = (model: M.Identified<M.Person>) => {
            // When the persons are loaded, try to update the created person, to make updates incremental.
            const newLoaded$ = H.Stream.withoutNulls(
                loadedTable$
                    .map(list => {
                        const index = list.indexMap[model.id];
                        return index >= 0 ? list.persons[index].data : null;
                    })
            );

            const newPerson$ = Person$.create(model, selected$, newLoaded$);
            return newPerson$;
        }

        const newPersons$ = this.add$.map(createPerson$);

        // When loading, try to reuse persons with the same id, to get incremental updates.
        const loads$ = loadedTable$.snapshot(personsTable$, (models, table$) => {
            const newPersons$ = models.persons.map(model => {
                const index = table$.indexMap[model.id];
                const person$ = index >= 0 ? table$.persons$[index] : createPerson$(model);
                return person$;
            });

            return Splice.replace(newPersons$);
        });

        // Accumulate splices into a persons array
        const appends$ = newPersons$.map(p => Splice.append(p));
        const removes$ = this.remove$.snapshot1(selected$).filter(F.isDottable).map(person => Splice.remove(person!));
        const splices$ = loads$.orElse(appends$).orElse(removes$);
        persons$.loop(splices$.accum<PersonArray$>([], Splice.reduce));

        // Compute the next selection
        // TODO: Also take the loaded selection-id into account.
        const selects$ = splices$.snapshot(persons$, Splice.selected).orElse(this.select$).hold(null);
        selected$.loop(selects$);

        const canRemove$ = selected$.map(p => p !== null);

        // Expose serializable data.
        const personsState$ = S.Cell.switchC(persons$.map(ps => F.flattenCells(ps.map(p => p.state$))));
        const state$ = personsState$.lift(selected$, (persons, s) => ({ persons, selectedId: s ? s.modelId : 0 }));

        this.canRemove$ = canRemove$;
        this.selected$ = selected$;
        this.persons$ = persons$;
        this.state$ = state$;
    }

    public static create(loaded$: S.Stream<M.PersonList>) {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new PersonList$(loaded$));
    }
}
