import * as M from "../models"
import * as S from "sodiumjs"
import * as F from "sodium-frp-react"

export type MaybePerson$ = Person$ | null;

export class Person$ {
    public readonly setFirstName$ = new S.StreamSink<string>();
    public readonly setLastName$ = new S.StreamSink<string>();

    public readonly modelId: M.Identifier;
    
    public readonly firstName$: S.Cell<string>;
    public readonly lastName$: S.Cell<string>;
    public readonly fullName$: S.Cell<string>;
    public readonly isSelected$: S.Cell<boolean>;

    public readonly state$: S.Cell<M.Identified<M.Person>>;
    
    private constructor(model: M.Identified<M.Person>, selected$: S.Cell<MaybePerson$>, loaded$: S.Stream<M.Person>) {
        const split$ = F.splitStream(M.Person.keys, loaded$);

        this.modelId = model.id;
        this.firstName$ = split$.firstName.orElse(this.setFirstName$).hold(model.data.firstName);
        this.lastName$ = split$.lastName.orElse(this.setLastName$).hold(model.data.lastName);
        this.fullName$ = this.firstName$.lift(this.lastName$, (fn, ln) => fn.length || ln.length ? `${fn} ${ln}` : "<incognito>");
        this.isSelected$ = selected$.map(p => p === this);

        // Expose serializable data.
        this.state$ = this.firstName$.lift(this.lastName$, (firstName, lastName) => M.Identified.from(this.modelId, { firstName, lastName}));
    }

    public static create(model: M.Identified<M.Person>, selected$: S.Cell<MaybePerson$>, loaded$: S.Stream<M.Person>) {
        // When using Sodium loops, a circuit must be constructed inside an explicit transaction
        return S.Transaction.run(() => new Person$(model, selected$, loaded$));
    }
}

