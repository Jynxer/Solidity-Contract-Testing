var Players = artifacts.require("Players");
var Teams = artifacts.require("Teams");

contract('Teams', function(accounts) {

	var teamsInstance;
	const addressThree = accounts[3];
	const addressFour = accounts[4];

	it('registers a team correctly', function() {
		return Teams.deployed().then(async function(instance) {
			teamsInstance = instance;
			await teamsInstance.createPlayer("Heart", addressThree);
			await teamsInstance.createPlayer("Brain", addressFour);
			return teamsInstance.createTeam("THC", [addressThree, addressFour]);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'teamCreated', 'should be the "teamCreated" event');
			assert.equal(receipt.logs[0].args._teamName, "THC", 'team name correctly registered');
			assert.equal(receipt.logs[0].args._teamPlayers[0], addressThree, 'team address zero correctly registered');
			assert.equal(receipt.logs[0].args._teamPlayers[1], addressFour, 'team address one correctly registered');
			assert.equal(receipt.logs[0].args._eloRating.toNumber(), 1600, 'elo rating correctly registered');
		});
	});

	it('correctly gets a team by ID', function() {
		return Teams.deployed().then(async function(instance) {
			teamsInstance = instance;
			await teamsInstance.createPlayer("The Girl", accounts[5]);
			await teamsInstance.createTeam("In The Blue Jumper", [accounts[5]]);
			return teamsInstance.getTeamById(1);
		}).then(function(team) { 
			assert.equal(team[0], "In The Blue Jumper", 'Gets team name');
			assert.equal(team[1][0], accounts[5], 'Gets players in team');
			assert.equal(team[2], 1, 'Gets number of players in team');
			assert.equal(team[3], 0, 'Gets team totalWagered');
			assert.equal(team[4], 0, 'Gets team totalWon');
			assert.equal(team[5], 0, 'Gets team totalPlayed');
			assert.equal(team[6].toNumber(), 1600, 'Gets team elo rating');
		});
	});

	it('correctly deletes an existing team', function() {
		return Teams.deployed().then(async function(instance) {
			teamsInstance = instance;
			await teamsInstance.createPlayer("Liar", accounts[6]);
			await teamsInstance.createTeam("Believer", [accounts[6]]);
			return teamsInstance.deleteTeam(2);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'teamDeleted', 'should be the "teamDeleted" event');
			assert.equal(receipt.logs[0].args._teamName, 'Believer', 'team name correctly deleted');
			assert.equal(receipt.logs[0].args._id, 2, 'team id correctly deleted');
		});
	});

	it('correctly updates an existing team', function() {
		return Teams.deployed().then(async function(instance) {
			teamsInstance = instance;
			await teamsInstance.createPlayer("Twelve", accounts[7]);
			await teamsInstance.createTeam("TwentyFour", [accounts[7]]);
			return teamsInstance.updateTeam(2, 100, 0, false, 23);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'teamUpdated', 'should be the "teamUpdated" event');
			assert.equal(receipt.logs[0].args._teamName, 'TwentyFour', 'named team correctly updated');
			assert.equal(receipt.logs[0].args._id, 2, 'id of updated team');
			assert.equal(receipt.logs[0].args._totalWagered, 100, 'totalWagered correctly updated');
			assert.equal(receipt.logs[0].args._totalWon, 0, 'totalWon correctly updated');
			assert.equal(receipt.logs[0].args._totalPlayed, 1, 'totalPlayed correctly updated');
			assert.equal(receipt.logs[0].args._eloRating.toNumber(), 1577, 'teamelo rating correctly updated');
		});
	});

	it('correctly resets an existing teams statistics', function() {
		return Teams.deployed().then(async function(instance) {
			teamsInstance = instance;
			return teamsInstance.resetTeamStats(2);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'teamStatsReset', 'should be the "teamStatsReset" event');
			assert.equal(receipt.logs[0].args._teamName, 'TwentyFour', 'named team stats reset');
			assert.equal(receipt.logs[0].args._id, 2, 'correct id');
			assert.equal(receipt.logs[0].args._totalWagered.toNumber(), 0, 'totalWagered correctly reset');
			assert.equal(receipt.logs[0].args._totalWon, 0, 'totalWon correctly reset');
			assert.equal(receipt.logs[0].args._totalPlayed, 0, 'totalPlayed correctly reset');
			assert.equal(receipt.logs[0].args._eloRating.toNumber(), 1577, 'team elo rating correctly not reset');
		});
	});

});
