import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

function List(props) {
    const bidderList = props.bidderList;
  return (
    <ListGroup as="ol" numbered>
        {bidderList.map((bidder, idx) => 
      <ListGroup.Item key={idx}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{bidder.bidderName}</div>
        </div>
        <Badge bg="primary" pill>
          {bidder.amount}
        </Badge>
      </ListGroup.Item>
    )}
    </ListGroup>
  );
}

export default List;