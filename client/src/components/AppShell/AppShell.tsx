import { Routes, Route } from 'react-router-dom';
import { useNetwork, useSigner } from 'wagmi';
import { Alert } from 'react-bootstrap';
import { StartPage } from '../StartPage/StartPage';
import { AdminPanel } from '../AdminPanel/AdminPanel';
import { BookingPanel } from '../BookingPanel/BookingPanel';

export function AppShell() {
  const [{ data: networkData }] = useNetwork();
  const [{ data: signerData }] = useSigner();

  return (
    <>
      {signerData && networkData.chain?.id !== 1337 && (
        <span>
          <Alert className="text-center" variant="danger">
            <p>Wrong network</p>
            <p>Please select local network: port 8545</p>
          </Alert>
        </span>
      )}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="admin-panel" element={<AdminPanel />} />
        <Route path="coke-booking" element={<BookingPanel />} />
      </Routes>
    </>
  );
}
