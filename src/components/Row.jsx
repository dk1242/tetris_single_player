import * as React from "react";
import Block from "./Block";

const Row = (props) => {
  return (
    <div style={{ display: "flex", gap: "1px" }}>
      <Block blockVal={props.rowVal[0]} />
      <Block blockVal={props.rowVal[1]} />
      <Block blockVal={props.rowVal[2]} />
      <Block blockVal={props.rowVal[3]} />
      <Block blockVal={props.rowVal[4]} />
      <Block blockVal={props.rowVal[5]} />
      <Block blockVal={props.rowVal[6]} />
      <Block blockVal={props.rowVal[7]} />
    </div>
  );
};
export default Row;
