var Players = artifacts.require("Players");

contract('Players', function(accounts) {

	var playersInstance;

	it('registers the player with the correct values', function() {
		return Players.deployed().then(function(instance) {
			playersInstance = instance;
			return playersInstance.createPlayer("Jynxer", accounts[0]);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'playerCreated', 'should be the "playerCreated" event');
			assert.equal(receipt.logs[0].args._username, "Jynxer", 'player username correctly registered');
			assert.equal(receipt.logs[0].args._address, accounts[0], 'player address correctly registered');
		});
	});

	it('correctly gets a player from an address', function() {
		return Players.deployed().then(function(instance) {
			playersInstance = instance;
			playersInstance.createPlayer("Jordan", accounts[1]);
			return playersInstance.getPlayerByAddress(accounts[1]);
		}).then(function(player) {
			assert.equal(player[0], "Jordan", 'Gets players username');
			assert.equal(player[1], 0, 'Gets players totalWagered');
			assert.equal(player[2], 0, 'Gets players totalWon');
			assert.equal(player[3], 0, 'Gets players totalPlayed');
			assert.equal(player[4].toNumber(), 1600, 'Gets players eloRating');
		});
	});

	it('correctly deletes an existing player', function() {
		return Players.deployed().then(function(instance) {
			playersInstance = instance;
			playersInstance.createPlayer("BrokenSteel", accounts[2])
			return playersInstance.deletePlayer(accounts[2]);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'playerDeleted', 'should be the "playerDeleted" event');
			assert.equal(receipt.logs[0].args._username, "BrokenSteel", 'player username correctly deleted');
			assert.equal(receipt.logs[0].args._address, accounts[2], 'player address correctly deleted');
		});
	});

	it('correctly updates an existing player', function() {
		return Players.deployed().then(async function(instance) {
			playersInstance = instance;
			await playersInstance.createPlayer("Vanelope", accounts[3]);
			return playersInstance.updatePlayer(accounts[3], 150, 150, true, 32);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'Triggers one event');
			assert.equal(receipt.logs[0].event, 'playerUpdated', 'should be the "playerUpdated" event');
			assert.equal(receipt.logs[0].args._username, 'Vanelope', 'correct username');
			assert.equal(receipt.logs[0].args._totalWagered.toNumber(), 150, 'totalWagered correctly updated');
			assert.equal(receipt.logs[0].args._totalWon.toNumber(), 150, 'totalWon correctly updated');
			assert.equal(receipt.logs[0].args._totalPlayed.toNumber(), 1, 'totalPlayed correctly updated');
			assert.equal(receipt.logs[0].args._eloRating.toNumber(), 1632, 'player elo rating correctly not updated');
		});
	});

	it('correctly sets an existing players elo rating', function() {
		return Players.deployed().then(async function(instance) {
			playersInstance = instance;
			await playersInstance.setEloRating(accounts[3], 1888);
			return playersInstance.getPlayerByAddress(accounts[3]);
		}).then(function(player) {
			assert.equal(player[0], "Vanelope", 'Gets players username');
			assert.equal(player[1], 150, 'Gets players totalWagered');
			assert.equal(player[2], 150, 'Gets players totalWon');
			assert.equal(player[3], 1, 'Gets players totalPlayed');
			assert.equal(player[4].toNumber(), 1888, 'Gets players eloRating');
		});
	});

		it('correctly resets an existing players statistics', function() {
		return Players.deployed().then(async function(instance) {
			playersInstance = instance;
			await playersInstance.resetPlayerStats(accounts[3]);
			return playersInstance.getPlayerByAddress(accounts[3]);
		}).then(function(player) {
			assert.equal(player[0], "Vanelope", 'Gets players username');
			assert.equal(player[1], 0, 'Gets players totalWagered');
			assert.equal(player[2], 0, 'Gets players totalWon');
			assert.equal(player[3], 0, 'Gets players totalPlayed');
			assert.equal(player[4].toNumber(), 1888, 'Gets players eloRating');
		});
	});


});