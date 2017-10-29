import * as React from 'react';
import * as FRP from "sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models"
import * as C from "../circuits"

import { PersonRecordEditor } from "./PersonRecordEditor"
import { PersonItemView } from "./PersonItemView"
import { PersonListView } from "./PersonListView"

interface Props {
    readonly list: C.PersonList;
}

const PersonDetailView = FRP.lift((props: { selected: C.Person | null }) => {
    return props.selected ? <PersonRecordEditor person={props.selected} /> : <div />;
});

export class PersonListEditor extends React.PureComponent<Props> {
    private addPerson = (e: React.MouseEvent<HTMLElement>) => this.props.list.add.send(M.Person.empty);
    private removePerson = (e: React.MouseEvent<HTMLElement>) => this.props.list.remove.send(S.Unit.UNIT);
    private selectPerson = (p: C.Person) => this.props.list.select.send(p);

    public render() {
        const { persons, selected } = this.props.list;

        return (
            <div className="group">
                <div className="toolbar">
                    <FRP.button onClick={this.addPerson}>Add new person</FRP.button>
                    <FRP.button onClick={this.removePerson}>Remove selected person</FRP.button>
                </div>
                <div className="group">
                    <PersonDetailView selected={selected} />
                </div>
                <div className="group">
                    <PersonListView persons={persons} select={this.selectPerson} />
                </div>
            </div>
        );
    }
}
