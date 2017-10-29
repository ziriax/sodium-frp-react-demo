import *  as React from 'react'
import * as C from "../circuits"
import * as V from "../views"

export class App extends React.PureComponent {

  private readonly list = C.PersonList.create();

  render() {
    return <V.PersonListEditor list={this.list} />
  }
}
