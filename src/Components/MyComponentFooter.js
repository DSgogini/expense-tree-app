import { Component } from "react";

export default class MyComponentFooter extends Component {
  render() {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className="App-header"
      >
        <h1>This is Footer !</h1>
      </div>
    );
  }
}
