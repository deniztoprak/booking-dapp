import { useEffect, useState } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import { useAccount, useContract, useNetwork, useSigner } from "wagmi";
import { Web3Connector } from "../../components/Web3Connector/Web3Connector";
import { defaults } from "../../constants/defaults";
import RoomBooking from "../../contracts/RoomBooking.json";

export function AdminPanel() {
  const [ownerAddress, setOwnerAddress] = useState("");

  const [{ data: networkData }] = useNetwork();
  const [{ data: accountData }] = useAccount();
  const [{ data: signerData }] = useSigner();

  const networkId = (networkData.chain?.id ||
    defaults.networkId) as keyof typeof RoomBooking.networks;
  const isNormalUser =
    accountData && ownerAddress && accountData.address !== ownerAddress;

  const contract = useContract({
    addressOrName: RoomBooking.networks[networkId].address,
    contractInterface: RoomBooking.abi,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    if (signerData) {
      contract.owner().then(setOwnerAddress);
    }
  }, [signerData, contract]);

  return (
    <article>
      <Container className="text-center">
        <Row>
          <h1 className=" mt-5">Admin Panel</h1>
          <h3 className="mt-3 mb-4">Please connect your admin wallet</h3>
        </Row>
        <Row>
          <Web3Connector></Web3Connector>
        </Row>
        <Row>
          {isNormalUser && (
            <Alert variant="danger">You are not the admin user</Alert>
          )}
        </Row>
      </Container>
    </article>
  );
}
