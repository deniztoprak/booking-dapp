// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../client/node_modules/@openzeppelin/contracts/access/AccessControl.sol";

contract RoomBooking is Ownable, AccessControl {
  // Events
  event TimeSlotBooked(string indexed _roomName, uint256 indexed _slotIndex, address _organizer);

  event BookingCanceled(string indexed _roomName, uint256 indexed _slotIndex);

  // Modifiers
  modifier validCompany(bytes32 _company) {
    require(_company == COKE_ID || _company == PEPSI_ID, "Unrecognized company");
    _;
  }

  modifier validRoom(bytes32 _company, string memory _roomName) {
    require(companies[_company].organizers[_roomName].length > 0, "Invalid room name");
    _;
  }

  modifier validTimeSlot(
    bytes32 _company,
    string memory _roomName,
    uint256 _slotIndex
  ) {
    require(_slotIndex < companies[_company].organizers[_roomName].length, "Invalid time slot");
    _;
  }

  // Data
  bytes32 private constant COKE_ID = keccak256("COKE");
  bytes32 private constant PEPSI_ID = keccak256("PEPSI");

  struct Company {
    string[] rooms;
    mapping(string => address[]) organizers;
  }

  mapping(bytes32 => Company) private companies;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _initCompanies();
  }

  function _initCompanies() private onlyOwner {
    for (uint256 i = 1; i <= 10; ++i) {
      string memory cokeRoomName = _createRoomName("C", i);
      string memory pepsiRoomName = _createRoomName("P", i);
      companies[COKE_ID].organizers[cokeRoomName] = new address[](10);
      companies[PEPSI_ID].organizers[pepsiRoomName] = new address[](10);
      companies[COKE_ID].rooms.push(cokeRoomName);
      companies[PEPSI_ID].rooms.push(pepsiRoomName);
    }
  }

  function _createRoomName(string memory _prefix, uint256 _index) private pure returns (string memory) {
    return string(abi.encodePacked(_prefix, Strings.toString(_index)));
  }

  function addEmployee(bytes32 _company, address _employeeAddress) public validCompany(_company) onlyOwner {
    grantRole(_company, _employeeAddress);
  }

  function removeEmployee(bytes32 _company, address _employeeAddress) public validCompany(_company) onlyOwner {
    revokeRole(_company, _employeeAddress);
  }

  function isEmployee(bytes32 _company, address _employeeAddress) public view validCompany(_company) returns (bool) {
    return hasRole(_company, _employeeAddress);
  }

  function getRooms(bytes32 _company) public view onlyRole(_company) returns (string[] memory) {
    return companies[_company].rooms;
  }

  function getOrganizers(bytes32 _company, string memory _roomName) public view onlyRole(_company) validRoom(_company, _roomName) returns (address[] memory) {
    return companies[_company].organizers[_roomName];
  }

  function bookTimeSlot(
    bytes32 _company,
    string memory _roomName,
    uint256 _slotIndex
  ) public onlyRole(_company) validRoom(_company, _roomName) validTimeSlot(_company, _roomName, _slotIndex) {
    require(companies[_company].organizers[_roomName][_slotIndex] == address(0), "Time slot already booked");

    companies[_company].organizers[_roomName][_slotIndex] = msg.sender;
    emit TimeSlotBooked(_roomName, _slotIndex, msg.sender);
  }

  function cancelBooking(
    bytes32 _company,
    string memory _roomName,
    uint256 _slotIndex
  ) public onlyRole(_company) validRoom(_company, _roomName) validTimeSlot(_company, _roomName, _slotIndex) {
    require(companies[_company].organizers[_roomName][_slotIndex] != address(0), "Time slot is not yet booked");
    require(companies[_company].organizers[_roomName][_slotIndex] == msg.sender, "Time slot is not booked by sender");

    companies[_company].organizers[_roomName][_slotIndex] = address(0);
    emit BookingCanceled(_roomName, _slotIndex);
  }
}
