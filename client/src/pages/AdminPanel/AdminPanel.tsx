import React, { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Row } from 'react-bootstrap';
import { useAccount, useContract, useNetwork, useSigner } from 'wagmi';
import { Web3Connector } from '../../components/Web3Connector/Web3Connector';
import { defaults } from '../../constants/defaults';
import RoomBooking from '../../contracts/RoomBooking.json';

export function AdminPanel() {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [cokeAddress, setCokeAddress] = useState('');
  const [pepsiAddress, setPepsiAddress] = useState('');

  const [{ data: networkData }] = useNetwork();
  const [{ data: accountData }] = useAccount();
  const [{ data: signerData }] = useSigner();

  const networkId = (networkData.chain?.id || defaults.networkId) as keyof typeof RoomBooking.networks;
  const isAdminUser = accountData?.address === ownerAddress;

  const contract = useContract({
    addressOrName: RoomBooking.networks[networkId].address,
    contractInterface: RoomBooking.abi,
    signerOrProvider: signerData,
  });

  const onAddressSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(cokeAddress, pepsiAddress);
  };

  const onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'cokeAddress') {
      setCokeAddress(event.target.value);
    } else if (event.target.id === 'pepsiAddress') {
      setPepsiAddress(event.target.value);
    }
  };

  useEffect(() => {
    if (signerData) {
      contract.owner().then(setOwnerAddress);
    }
  }, [signerData, contract]);

  return (
    <article>
      <Container>
        <Row className="text-center">
          <h1 className=" mt-5">Admin Panel</h1>
          {!accountData && <h3 className="mt-3 mb-4">Please connect with your admin wallet</h3>}
        </Row>
        <Row className="text-center">
          <Web3Connector></Web3Connector>
        </Row>
        <Row>
          {accountData &&
            ownerAddress &&
            (isAdminUser ? (
              <>
                <h2>Whitelist Wallets</h2>
                <Form onSubmit={onAddressSubmit}>
                  <Form.Group className="mt-3" controlId="cokeAddress">
                    <Form.Label>Coke Wallet Address:</Form.Label>
                    <Form.Control type="text" placeholder="Enter wallet address" onChange={onAddressChange} required />
                  </Form.Group>
                  <Form.Group className="mt-3" controlId="pepsiAddress">
                    <Form.Label>Pepsi Wallet Address:</Form.Label>
                    <Form.Control type="text" placeholder="Enter wallet address" onChange={onAddressChange} required />
                  </Form.Group>
                  <Button className="mt-3" variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </>
            ) : (
              <Alert className="text-center" variant="danger">
                You are not the admin user
              </Alert>
            ))}
        </Row>
      </Container>
    </article>
  );
}
