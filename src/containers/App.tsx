import *  as React from 'react'
import * as C from "../circuits"
import * as V from "../views"

export class App extends React.PureComponent {

  private readonly doc = C.Document.create();

  render() {
    return <V.DocumentView doc={this.doc} />
  }
}
