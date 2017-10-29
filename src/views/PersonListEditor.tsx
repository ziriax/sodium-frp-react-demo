import * as React from 'react';
import * as FRP from "sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models"
import * as C from "../circuits"

import { PersonItemEditor } from "./PersonItemEditor"
import { PersonItemView } from "./PersonItemView"
import { PersonListView } from "./PersonListView"

interface Props {
    readonly list: C.PersonList;
}

const PersonDetailView = FRP.lift((props: { selected: C.Person | null }) => {
    return props.selected ? <PersonItemEditor person={props.selected} /> : <div />;
});

export class PersonListEditor extends React.PureComponent<Props> {
    private addPerson = (e: React.MouseEvent<HTMLElement>) => this.props.list.add.send(M.Person.empty);

    private selectPerson = (p: C.Person) => this.props.list.select.send(p);

    public render() {
        const { persons, selected } = this.props.list;

        return (
            <div className="row">
                <div className="col-md-6">
                    <FRP.button onClick={this.addPerson}>Add new person</FRP.button>
                    <PersonListView persons={persons} select={this.selectPerson} />
                </div>
                <div className="col-md-6">
                    <PersonDetailView selected={selected} />
                </div>
            </div>
        );
    }
}
