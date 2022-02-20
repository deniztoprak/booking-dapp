import { getDefaultProvider, utils } from 'ethers';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Table, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { useAccount, useContract, useSigner, useContractEvent } from 'wagmi';
import { Web3Connector } from '../Web3Connector/Web3Connector';
import RoomBooking from '../../contracts/RoomBooking.json';

interface BookingPanelProps {
  companyName: string;
}

export const BookingPanel: FC<BookingPanelProps> = ({ companyName }) => {
  const BOOKING_START_TIME = 8;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const companyHash = useMemo(() => utils.keccak256(utils.toUtf8Bytes(companyName.toUpperCase())), [companyName]);

  const [isEmployee, setIsEmployee] = useState();
  const [rooms, setRooms] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');

  const [{ data: accountData }] = useAccount();
  const [{ data: signerData }] = useSigner();

  const contractConfig = {
    addressOrName: RoomBooking.networks['1337'].address,
    contractInterface: RoomBooking.abi,
    signerOrProvider: signerData || getDefaultProvider(),
  };

  const contract = useContract(contractConfig);

  const handleError = (error: Error) => {
    setToastText(error.message);
    setIsToastOpen(true);
    setIsTransactionPending(false);
  };

  useContractEvent(contractConfig, 'TimeSlotBooked', () => {
    contract.getOrganizers(companyHash, selectedRoom).then(setOrganizers).catch(handleError);
    setToastText('Time slot booked');
    setIsToastOpen(true);
    setIsTransactionPending(false);
  });

  useContractEvent(contractConfig, 'BookingCanceled', () => {
    contract.getOrganizers(companyHash, selectedRoom).then(setOrganizers).catch(handleError);
    setToastText('Booking canceled');
    setIsToastOpen(true);
    setIsTransactionPending(false);
  });

  const changeSelectedRoom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoom(event.target.value);
    contract.getOrganizers(companyHash, event.target.value).then(setOrganizers).catch(handleError);
  };

  const getTimeSlot = (index: number): string => {
    const startTime = BOOKING_START_TIME + index;
    const endTime = startTime + 1;
    return `${startTime.toString().padStart(2, '0')}:00 - ${endTime.toString().padStart(2, '0')}:00`;
  };

  const bookTimeSlot = (index: number): void => {
    setIsTransactionPending(true);
    contract.bookTimeSlot(companyHash, selectedRoom, index).catch(handleError);
  };

  const cancelBooking = (index: number): void => {
    setIsTransactionPending(true);
    contract.cancelBooking(companyHash, selectedRoom, index).catch(handleError);
  };

  useEffect(() => {
    if (signerData && accountData) {
      contract.isEmployee(companyHash, accountData?.address).then(setIsEmployee).catch(handleError);
    }
  }, [signerData]);

  useEffect(() => {
    if (isEmployee) {
      contract.getRooms(companyHash).then(setRooms).catch(handleError);
    }
  }, [isEmployee]);

  return (
    <article>
      <Container>
        <Row className="text-center">
          <h1 className=" mt-5">{companyName} Room Booking</h1>
          {!accountData && <h3 className="mt-3 mb-4">Please connect with your wallet</h3>}
        </Row>
        <Row className="text-center">
          <Web3Connector></Web3Connector>
        </Row>
        <Row>
          {accountData &&
            isEmployee !== undefined &&
            (isEmployee ? (
              <>
                <Form>
                  <Form.Group className="my-3" controlId="role">
                    <Form.Label>Select Room</Form.Label>
                    <Form.Select onChange={changeSelectedRoom} value={selectedRoom} required>
                      <option value="" disabled>
                        Select a room
                      </option>
                      {rooms.map((room: string) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Form>
                {organizers.length > 0 && (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Hour</th>
                        <th>Owner</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizers.map((organizer: string, index: number) => (
                        <tr key={index}>
                          <td>{getTimeSlot(index)}</td>
                          <td>
                            {organizer === ZERO_ADDRESS && <em>No owner</em>}
                            {organizer === accountData?.address && <strong>You</strong>}
                            {organizer !== ZERO_ADDRESS && organizer !== accountData?.address && organizer}
                          </td>
                          <td>
                            {organizer === accountData?.address ? (
                              <Button
                                variant="danger"
                                disabled={isTransactionPending}
                                onClick={() => cancelBooking(index)}
                              >
                                Cancel Booking
                              </Button>
                            ) : (
                              <Button
                                variant={organizer !== ZERO_ADDRESS ? 'secondary' : 'success'}
                                disabled={organizer !== ZERO_ADDRESS || isTransactionPending}
                                onClick={() => bookTimeSlot(index)}
                              >
                                Book time slot
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            ) : (
              <Alert className="text-center" variant="danger">
                You are not a {companyName} employee
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
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">{companyName} Booking</strong>
            <small>Transaction</small>
          </Toast.Header>
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </ToastContainer>
    </article>
  );
};
