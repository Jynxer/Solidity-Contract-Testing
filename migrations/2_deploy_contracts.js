const Players = artifacts.require("Players");
const Teams = artifacts.require("Teams");
const Escrow = artifacts.require("Escrow");

module.exports = function(deployer) {
  deployer.deploy(Players).then(function() {
  	return deployer.deploy(Teams).then(function() {
  		return deployer.deploy(Escrow, '0xEb0D027dffB795648057A62f71C896c29A05f201', '0xdf962e3355150B167b8F4446210d01CC7bE3ebE4');
  	});
  });
};
