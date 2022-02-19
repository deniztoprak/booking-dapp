// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import '../client/node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../client/node_modules/@openzeppelin/contracts/access/AccessControl.sol';

contract RoomBooking is Ownable, AccessControl {
    bytes32 private constant COKE_EMPLOYEE = keccak256('COKE_EMPLOYEE');
    bytes32 private constant PEPSI_EMPLOYEE = keccak256('PEPSI_EMPLOYEE');

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addEmployee(bytes32 _role, address _employeeAddress) public onlyOwner {
        grantRole(_role, _employeeAddress);
    }

    function removeEmployee(bytes32 _role, address _employeeAddress) public onlyOwner {
        revokeRole(_role, _employeeAddress);
    }

    function isEmployee(bytes32 _role, address _employeeAddress) public view returns (bool) {
        return hasRole(_role, _employeeAddress);
    }
}
