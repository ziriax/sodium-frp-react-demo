import * as React from 'react';
import * as FRP from "sodium-frp-react"

import * as S from "sodiumjs"
import * as M from "../models"
import * as C from "../circuits"

import { PersonItemView } from "./PersonItemView"

interface Props {
    readonly persons: C.PersonArray;
    select(person: C.Person): void;
}

// TODO: getItemKey should allow returning a number, like React
export const PersonListView = FRP.list(PersonItemView,
    (props: Props) => props.persons.map(person => ({ person, select: props.select })),
    item => `Person#${item.person.modelId}`);
