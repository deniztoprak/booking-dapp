import { Routes, Route, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import { StartPage } from "./pages/StartPage/StartPage";

export function App() {
  return (
    <main>
      <Navbar bg="primary" variant="dark">
        <Container fluid>
          <Link className="navbar-brand" to="/">
            Booking Dapp
          </Link>
          <Nav className="me-auto my-2">
            <Link className="nav-link" to="/admin">
              Admin Panel
            </Link>
            <Nav.Link href="/admin">Coca Cola</Nav.Link>
            <Nav.Link href="/admin">Pepsi</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="admin" element={<AdminPanel />} />
      </Routes>
    </main>
  );
}

export default App;
