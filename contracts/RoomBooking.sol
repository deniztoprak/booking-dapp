// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../client/node_modules/@openzeppelin/contracts/access/AccessControl.sol";

contract RoomBooking is Ownable, AccessControl {
  // Roles
  bytes32 private constant COKE_EMPLOYEE = keccak256("COKE_EMPLOYEE");
  bytes32 private constant PEPSI_EMPLOYEE = keccak256("PEPSI_EMPLOYEE");

  // Booking maps
  mapping(string => address[]) private _cokeBookings;
  mapping(string => address[]) private _pepsiBookings;

  // Booking indexes
  string[] public _cokeRooms;
  string[] public _pepsiRooms;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _createBookings();
  }

  // Role methods
  function addEmployee(bytes32 _role, address _employeeAddress) public onlyOwner {
    grantRole(_role, _employeeAddress);
  }

  function removeEmployee(bytes32 _role, address _employeeAddress) public onlyOwner {
    revokeRole(_role, _employeeAddress);
  }

  function isEmployee(bytes32 _role, address _employeeAddress) public view returns (bool) {
    return hasRole(_role, _employeeAddress);
  }

  // Booking methods
  function _createBookings() private {
    for (uint256 i = 1; i <= 10; ++i) {
      string memory cokeRoomName = _createRoomName("C", i);
      string memory pepsiRoomName = _createRoomName("P", i);
      _cokeBookings[cokeRoomName] = new address[](8);
      _pepsiBookings[pepsiRoomName] = new address[](8);
      _cokeRooms.push(cokeRoomName);
      _pepsiRooms.push(pepsiRoomName);
    }
  }

  function _createRoomName(string memory _prefix, uint256 _index) private pure returns (string memory) {
    return string(abi.encodePacked(_prefix, Strings.toString(_index)));
  }

  function getCokeRooms() public view onlyRole(COKE_EMPLOYEE) returns (string[] memory) {
    return _cokeRooms;
  }

  function getPepsiRooms() public view onlyRole(PEPSI_EMPLOYEE) returns (string[] memory) {
    return _pepsiRooms;
  }

  function getCokeBookings(string memory _roomName) public view onlyRole(COKE_EMPLOYEE) returns (address[] memory) {
    address[] memory booking = _cokeBookings[_roomName];
    require(booking.length > 0, "Invalid room name");

    return booking;
  }

  function getPepsiBookings(string memory _roomName) public view onlyRole(PEPSI_EMPLOYEE) returns (address[] memory) {
    address[] memory booking = _pepsiBookings[_roomName];
    require(booking.length > 0, "Invalid room name");

    return booking;
  }
}
