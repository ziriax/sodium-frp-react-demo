import * as React from 'react';
import * as FRP from "../sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models"
import * as C from "../circuits"

import { PersonItemView } from "./PersonItemView"
import { PersonItemEditor } from "./PersonItemEditor"

interface Props {
    readonly persons: C.PersonArray;
    select(person: C.Person): void;
}

export const PersonListView = FRP.list(PersonItemView,
    (props: Props) => props.persons.map(person => ({ person, select: props.select })),
    item => item.person.id);
