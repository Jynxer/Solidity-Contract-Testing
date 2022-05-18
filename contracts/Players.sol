// TO DO:
// Choose visibility and permissions for EVERYTHING
// Maybe add wallet balance as a player attribute

pragma solidity ^0.5.0;
import "./SafeMath.sol";

contract Players {
    
    //SafeMath functions for uint256 types
    using SafeMath for uint256;
    
    //Player object
    struct Player {
        string username;
        uint256 totalWagered;
        uint256 totalWon;
        uint256 totalPlayed;
        uint256 eloRating;
    }
    
    //Events
    event playerCreated(string _username, address _address);
    event playerDeleted(string _username, address _address);
    event playerUpdated(string _username, uint256 _totalWagered, uint256 _totalWon, uint256 _totalPlayed, uint256 _eloRating);

    //Maps player addresses to their object
    mapping(address => Player) players;
    //Array of player addresses
    address[] public playerAccounts;
    
    //Creates a new player with fresh stats
    function createPlayer(string memory _username, address _address) public {
        //Prevents duplicate accounts being created
        require(bytes (players[_address].username).length == 0);
        //Adds new player to mapping
        players[_address] = Player(_username, 0, 0, 0, 1600);
        //Adds new player's address to playerAccounts array
        playerAccounts.push(_address);
        emit playerCreated(_username, _address);
    }
    
    //Returns player object elements from player address
    function getPlayerByAddress(address _address) public view returns (string memory, uint256, uint256, uint256, uint256) {
        return(players[_address].username, players[_address].totalWagered, players[_address].totalWon, players[_address].totalPlayed, players[_address].eloRating);
    }
    
    //Deletes player from mapping and address array from player address
    function deletePlayer(address _address) public {
        require(players[_address].eloRating != 0);
        string memory deletingUsername = players[_address].username;
        delete players[_address];
        for (uint256 i = 0; i < playerAccounts.length; i++) {
            if (playerAccounts[i] == _address) {
                delete playerAccounts[i];
                playerAccounts.length = playerAccounts.length.sub(1);
            }
        }
        emit playerDeleted(deletingUsername, _address);
    }
    
    //Updates player's elements depending on outcome of game
    function updatePlayer(address _address, uint256 _amountWagered, uint256 _amountWon, bool _won, uint256 _eloChange) public {
        require(players[_address].eloRating != 0);
        players[_address].totalWagered = players[_address].totalWagered.add(_amountWagered);
        players[_address].totalPlayed = players[_address].totalPlayed.add(1);
        if (_won) {
            players[_address].totalWon = players[_address].totalWon.add(_amountWon);
            players[_address].eloRating = players[_address].eloRating.add(_eloChange);
        } else {
            players[_address].eloRating = players[_address].eloRating.sub(_eloChange);
        }
        emit playerUpdated(players[_address].username, players[_address].totalWagered, players[_address].totalWon, players[_address].totalPlayed, players[_address].eloRating);
    }

    //Manually set an elo rating for a player
    function setEloRating(address _address, uint256 _eloRating) public {
        require(players[_address].eloRating != 0);
        players[_address].eloRating = _eloRating;
    }

    //Resets a players statistics
    function resetPlayerStats(address _address) public {
        require(players[_address].eloRating != 0);
        players[_address].totalWagered = 0;
        players[_address].totalWon = 0;
        players[_address].totalPlayed = 0;
    }
    
}