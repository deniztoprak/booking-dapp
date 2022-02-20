import { Routes, Route } from 'react-router-dom';
import { useNetwork, useSigner } from 'wagmi';
import { Alert } from 'react-bootstrap';
import { StartPage } from '../../pages/StartPage/StartPage';
import { AdminPanel } from '../../pages/AdminPanel/AdminPanel';
import { CokeBooking } from '../../pages/CokeBooking/CokeBooking';

export function AppShell() {
  const [{ data: networkData }] = useNetwork();
  const [{ data: signerData }] = useSigner();

  return (
    <>
      {signerData && networkData.chain?.id !== 1337 && (
        <span>
          <Alert className="text-center" variant="danger">
            <p>Wrong network</p>
            <p>Please select local network: port 8545 </p>
          </Alert>
        </span>
      )}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="admin-panel" element={<AdminPanel />} />
        <Route path="coke-booking" element={<CokeBooking />} />
      </Routes>
    </>
  );
}
