import Spinner from "react-bootstrap/Spinner";

function Loading(props) {
  return (
    <div
      style={{
        padding: "20%",
        textAlign: "center",
      }}
    >
      <div>
        <Spinner variant={props.variant} animation="grow" />
      </div>
    </div>
  );
}

export default Loading;
