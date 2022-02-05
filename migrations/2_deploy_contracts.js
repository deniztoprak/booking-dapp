var RoomBooking = artifacts.require("./RoomBooking.sol");

module.exports = function (deployer) {
  deployer.deploy(RoomBooking);
};
