import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function StartPage() {
  return (
    <article>
      <Container>
        <Row>
          <h1 className="text-center my-5">Welcome to Booking Dapp</h1>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              <ListGroup.Item className="py-4">
                If you are the <strong>admin</strong>, go to the <Link to="/admin-panel">Admin Panel</Link> to add
                wallet addresses of employees.
              </ListGroup.Item>
              <ListGroup.Item className="py-4">
                If you are a <strong>Coke employee</strong>, go to the <Link to="/coke-booking">Coke Booking Page</Link>{' '}
                to book your meeting rooms.
              </ListGroup.Item>
              <ListGroup.Item className="py-4">
                If you are a <strong>Pepsi employee</strong>, go to the <Link to="/pepsi-">Pepsi Booking page</Link> to
                book your meeting rooms.
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </article>
  );
}
