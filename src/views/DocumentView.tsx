import * as React from 'react';
import * as FRP from "sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models"
import * as C from "../circuits"
import { PersonListEditor } from '.';

interface Props {
    readonly doc: C.Document;
}

export class DocumentView extends React.PureComponent<Props> {
    private save = () => this.props.doc.save.send(S.Unit.UNIT)
    private load = () => this.props.doc.load.send(S.Unit.UNIT);

    public render() {
        return (
            <div className="group">
                <div className="toolbar">
                    <FRP.button onClick={this.load}>Load</FRP.button>
                    <FRP.button onClick={this.save}>Save</FRP.button>
                </div>
                <PersonListEditor list={this.props.doc.list} />
            </div>
        );
    }
}
