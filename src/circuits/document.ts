import * as M from "../models"
import * as S from "sodiumjs"

import { Splice } from "./splice"
import { Person, MaybePerson } from "./person"
import { PersonList } from "./personList"

export class Document {
    public readonly load = new S.StreamSink<S.Unit>();
    public readonly save = new S.StreamSink<S.Unit>();
    public readonly list: PersonList;

    private constructor(storage: Storage, key: string) {
        const selected = new S.CellLoop<Person>();

        // TODO: The loading/saving part should be moved to another class.
        const loaded = this.load.map(u => M.PersonList.loadFrom(storage, key));

        // Construct reactive list of persons, passing the newly loaded data 
        this.list = PersonList.create(loaded);

        // When saving, take the serializable data from the list, and store it.
        this.save.snapshot(this.list.serializable, (u, s) => s).listen(s => M.PersonList.saveTo(s, storage, key));
    }

    public static create(storage: Storage = window.localStorage, key = "state") {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new Document(storage, key));
    }
}
