//TO DO:
//Choose visibility and permissions for EVERYTHING

pragma solidity ^0.5.0;
import "./SafeMath.sol";
import "./Players.sol";

contract Teams is Players {

	//SafeMath functions for uint256 typ
	using SafeMath for uint256;

	//Team object
	struct Team {
		string teamName;
		address[] teamPlayers;
		uint256 teamSize;
		uint256 totalWagered;
		uint256 totalWon;
		uint256 totalPlayed;
		uint256 eloRating;
	}

	event teamCreated(string _teamName, address[] _teamPlayers, uint256 _id, uint256 _eloRating);
	event teamDeleted(string _teamName, uint256 _id);
    event teamUpdated(string _teamName, uint256 _id, uint256 _totalWagered, uint256 _totalWon, uint256 _totalPlayed, uint256 _eloRating);
    event teamStatsReset(string _teamName, uint256 _id, uint256 _totalWagered, uint256 _totalWon, uint256 _totalPlayed, uint256 _eloRating);

	//Maps ids to Team objects
	mapping(uint256 => Team) teams;
	//Array of names
	string[] public teamNames;

	//Require team name to be unique then can index by team name or hashed team name cast to unt256
	function createTeam(string memory _teamName, address[] memory _teamPlayers) public {
		bool uniqueName = true;
		for (uint256 i = 0; i < teamNames.length; i++) {
			if (keccak256(abi.encodePacked((_teamName))) == keccak256(abi.encodePacked((teamNames[i])))) {
				uniqueName = false;
			}
		}
		require(uniqueName == true);
		uint256 _eloRating = 0;
		for (uint256 i = 0; i < _teamPlayers.length; i++) {
			_eloRating = _eloRating.add(players[_teamPlayers[i]].eloRating);
		}
		_eloRating = _eloRating.div(_teamPlayers.length);
        uint256 id = teamNames.push(_teamName) - 1;
        teams[id] = Team(_teamName, _teamPlayers, _teamPlayers.length, 0, 0, 0, _eloRating);
        emit teamCreated(_teamName, _teamPlayers, id, _eloRating);
	}

	//Returns team object elements from team id
	function getTeamById(uint256 _id) public view returns (string memory, address[] memory, uint256, uint256, uint256, uint256, uint256) {
		return(teams[_id].teamName, teams[_id].teamPlayers, teams[_id].teamSize, teams[_id].totalWagered, teams[_id].totalWon, teams[_id].totalPlayed, teams[_id].eloRating);
	}

	//Deletes team from mapping and teamName array 
	function deleteTeam(uint256 _id) public {
		require(teams[_id].eloRating != 0);
		string memory deletingTeamName = teams[_id].teamName;
		delete teams[_id];
		for (uint256 i = 0; i < teamNames.length; i++) {
			if (keccak256(abi.encodePacked(teamNames[i])) == keccak256(abi.encodePacked(deletingTeamName))) {
				delete teamNames[i];
				teamNames.length = teamNames.length.sub(1);
				emit teamDeleted(deletingTeamName, _id);
			}
		}
	}

	//Updates team's elements depending on outcome of game - NOTE: Does not update totalPlayed.
	function updateTeam(uint256 _id, uint256 _amountWagered, uint256 _amountWon, bool _won, uint256 _eloChange) public {
		require(teams[_id].eloRating != 0);
		teams[_id].totalWagered = teams[_id].totalWagered.add(_amountWagered);
		teams[_id].totalWon = teams[_id].totalWon.add(_amountWon);
		if (_won) {
            teams[_id].totalWon = teams[_id].totalWon.add(_amountWon);
            teams[_id].eloRating = teams[_id].eloRating.add(_eloChange);
        } else {
            teams[_id].eloRating = teams[_id].eloRating.sub(_eloChange);
        }
        teams[_id].totalPlayed = teams[_id].totalPlayed.add(1);
        emit teamUpdated(teams[_id].teamName, _id, teams[_id].totalWagered, teams[_id].totalWon, teams[_id].totalPlayed, teams[_id].eloRating);
	}

	//Resets a team's statistics
	function resetTeamStats(uint256 _id) public {
		require(teams[_id].eloRating != 0);
		teams[_id].totalWagered = 0;
		teams[_id].totalWon = 0;
		teams[_id].totalPlayed = 0;
		emit teamStatsReset(teams[_id].teamName, _id, teams[_id].totalWagered, teams[_id].totalWon, teams[_id].totalPlayed, teams[_id].eloRating);
	}

}