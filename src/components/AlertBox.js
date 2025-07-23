import Alert from "react-bootstrap/Alert";

export default function AlertBox(props) {
  var style = "none";
  const message = props.message;
  if (props.showAlert) {
    style = "block";
  }
  return (
    <div className="text-center">
    <Alert variant={props.variant} style={{ display: style }}>
      {message}
    </Alert>
    </div>
  );
}
