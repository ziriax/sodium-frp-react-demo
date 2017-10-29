import * as React from 'react';
import * as FRP from "sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models/person"
import * as C from "../circuits/person"

interface Props {
    readonly person: C.Person;
}

export class PersonRecordEditor extends React.PureComponent<Props> {

    setFirstName = (e: React.ChangeEvent<HTMLInputElement>) => this.props.person.firstName.send(e.currentTarget.value);

    setLastName = (e: React.ChangeEvent<HTMLInputElement>) => this.props.person.lastName.send(e.currentTarget.value);

    public render() {

        const { firstName, fullName, lastName } = this.props.person;

        return (
            <table>
                <tbody>
                    <tr>
                        <td>First name:&nbsp;</td>
                        <td><FRP.input value={firstName} onChange={this.setFirstName} /></td>
                    </tr>
                    <tr>
                        <td>Last name:&nbsp;</td>
                        <td><FRP.input value={lastName} onChange={this.setLastName} /></td>
                    </tr>
                    <tr>
                        <td>Full name:&nbsp;</td>
                        <td><FRP.span>{fullName}</FRP.span></td>
                    </tr>
                </tbody>
            </table >
        );
    }
}
