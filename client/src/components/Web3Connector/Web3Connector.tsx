import { Alert, Button } from "react-bootstrap";
import { useAccount, useConnect } from "wagmi";

export function Web3Connector() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();

  const injectedConnector = connectData.connectors[0];

  return (
    <section>
      {accountData ? (
        <Alert variant="secondary">
          <div>
            <div>
              <strong>Your address is:</strong> {accountData.address}
            </div>
            <div className="mt-2">
              Connected with {accountData.connector?.name}
            </div>
            <Button className="mt-2" variant="danger" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        </Alert>
      ) : injectedConnector.ready ? (
        <>
          <Button variant="success" onClick={() => connect(injectedConnector)}>
            Connect with {injectedConnector.name}
          </Button>
          {connectError && (
            <Alert variant="danger">
              {connectError?.message ?? "Connection failed"}
            </Alert>
          )}
        </>
      ) : (
        <Alert variant="danger">Please install MetaMask</Alert>
      )}
    </section>
  );
}
