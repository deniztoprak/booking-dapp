import React, { useEffect, useState } from 'react';
import { getDefaultProvider, utils } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { Alert, Button, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { useAccount, useContract, useSigner, useContractEvent } from 'wagmi';
import { Web3Connector } from '../../components/Web3Connector/Web3Connector';
import RoomBooking from '../../contracts/RoomBooking.json';

export function AdminPanel() {
  const adminForm = React.createRef<HTMLFormElement>();
  const [ownerAddress, setOwnerAddress] = useState('');
  const [employeeCompany, setEmployeeCompany] = useState('');
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');

  const [{ data: accountData }] = useAccount();
  const [{ data: signerData }] = useSigner();

  const isAdminUser = accountData?.address === ownerAddress;

  const contractConfig = {
    addressOrName: RoomBooking.networks['1337'].address,
    contractInterface: RoomBooking.abi,
    signerOrProvider: signerData || getDefaultProvider(),
  };

  const contract = useContract(contractConfig);

  useContractEvent(contractConfig, 'RoleGranted', ([company, account]) => {
    setToastText(`Employee ${account} has been added`);
    setIsToastOpen(true);
    setIsTransactionPending(false);
  });

  useContractEvent(contractConfig, 'RoleRevoked', ([company, account]) => {
    setToastText(`Employee ${account} has been removed`);
    setIsToastOpen(true);
    setIsTransactionPending(false);
  });

  const handleError = (error: Error) => {
    setToastText(error.message);
    setIsToastOpen(true);
    setIsTransactionPending(false);
  };

  const onCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployeeCompany(event.target.value);
  };

  const onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeAddress(event.target.value);
  };

  const onEmployeeAdd = () => {
    if (adminForm.current?.reportValidity()) {
      setIsTransactionPending(true);
      const companyHash = utils.keccak256(utils.toUtf8Bytes(employeeCompany));
      contract.addEmployee(companyHash, getAddress(employeeAddress)).catch(handleError);
    }
  };

  const onEmployeeRemove = () => {
    if (adminForm.current?.reportValidity()) {
      setIsTransactionPending(true);
      const companyHash = utils.keccak256(utils.toUtf8Bytes(employeeCompany));
      contract.removeEmployee(companyHash, getAddress(employeeAddress)).catch(handleError);
    }
  };

  useEffect(() => {
    if (signerData) {
      contract.owner().then(setOwnerAddress).catch(handleError);
    }
  }, [signerData, contract]);

  return (
    <article>
      <Container>
        <Row className="text-center">
          <h1 className=" mt-5">Admin Panel</h1>
          {!accountData && <h3 className="mt-3 mb-4">Please connect with your wallet</h3>}
        </Row>
        <Row className="text-center">
          <Web3Connector></Web3Connector>
        </Row>
        <Row>
          {accountData &&
            ownerAddress &&
            (isAdminUser ? (
              <>
                <h2>Add / Remove Employees</h2>
                <Form ref={adminForm}>
                  <Form.Group className="mt-3" controlId="role">
                    <Form.Label>Select Company</Form.Label>
                    <Form.Select onChange={onCompanyChange} value={employeeCompany} required>
                      <option value="" disabled>
                        Select a company
                      </option>
                      <option value="COKE">Coke</option>
                      <option value="PEPSI">Pepsi</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="my-3" controlId="address">
                    <Form.Label>Employee's Wallet Address:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter wallet address"
                      value={employeeAddress}
                      onChange={onAddressChange}
                      minLength={42}
                      maxLength={42}
                      required
                    />
                  </Form.Group>
                  <Button disabled={isTransactionPending} variant="success" onClick={onEmployeeAdd}>
                    Add Employee
                  </Button>
                  <Button disabled={isTransactionPending} className="ms-3" variant="danger" onClick={onEmployeeRemove}>
                    Remove Employee
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
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={isToastOpen}
          onClose={() => {
            setIsToastOpen(false);
          }}
        >
          <Toast.Header>
            <strong className="me-auto">Admin Panel</strong>
            <small>Transaction</small>
          </Toast.Header>
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </ToastContainer>
    </article>
  );
}
