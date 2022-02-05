import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useAccount, useConnect, useContract, useSigner } from "wagmi";
import RoomBooking from "../../contracts/RoomBooking.json";

export function AdminPanel() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: signerData }] = useSigner();

  const injectedConnector = connectData.connectors[0];
  const [owner, setOwner] = useState("");

  const contract = useContract({
    addressOrName: RoomBooking.networks["1337"].address,
    contractInterface: RoomBooking.abi,
    signerOrProvider: signerData,
  });

  if (signerData) {
    contract.owner().then(setOwner);
  } else {
    console.log("nope");
  }

  return (
    <article>
      {accountData ? (
        <div>
          <div>{accountData.address}</div>
          <div>Connected to {accountData.connector?.name}</div>
          <button onClick={disconnect}>Disconnect</button>
          <br></br>
          Owner: {owner}
          <br></br>
          Wallet: {accountData.address}
        </div>
      ) : injectedConnector.ready ? (
        <>
          <Button
            variant="secondary"
            onClick={() => connect(injectedConnector)}
          >
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
    </article>
  );
}
