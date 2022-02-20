import { NavLink } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Provider } from 'wagmi';
import { AppShell } from './components/AppShell/AppShell';

export function App() {
  return (
    <main>
      <Navbar bg="primary" variant="dark">
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/">
            Booking Dapp
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/admin-panel">
              Admin Panel
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coke-booking">
              Coke Room Booking
            </Nav.Link>
            <Nav.Link as={NavLink} to="/pepsi-booking">
              Pepsi Room Booking
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Provider autoConnect>
        <AppShell></AppShell>
      </Provider>
    </main>
  );
}

export default App;
