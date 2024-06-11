const Block = (props) => {
  const colors = [
    "white",
    "orange",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
  ];
  const val = props.blockVal;
  return (
    <div
      style={{
        height: "50px",
        width: "50px",
        border: "2px solid black",
        backgroundColor: colors[val],
      }}
    ></div>
  );
};

export default Block;
