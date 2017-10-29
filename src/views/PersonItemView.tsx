import * as React from 'react';
import * as FRP from "sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models"
import * as C from "../circuits"

interface Props {
    readonly person: C.Person;
    select(person: C.Person): void;
}

export class PersonItemView extends React.PureComponent<Props> {
    private select = (e: React.SyntheticEvent<HTMLElement>) => this.props.select(this.props.person);

    public render() {
        const { person } = this.props;
        const className = person.isSelected.map(x => `list-group-item ${x ? "active" : ""} selectable`);
        return (
            <FRP.li className={className} onClick={this.select}>
                <FRP.sample cell={person.fullName} />
            </FRP.li>
        );
    }
}
