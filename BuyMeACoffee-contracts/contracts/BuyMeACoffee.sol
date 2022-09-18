/// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract BuyMeACoffee {
    /// Event to emti when a Memo is created.
    event NewMemo (
        address indexed from, 
        uint256 timestamp, 
        string name,
        string message
        );

    /// Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    /// Address of contract deployer. Marked payable so that we can withdraw to
    /// this later.
    address payable owner;
    Memo [] memos;

    constructor(){
        /// store the address of the deployer as a payable address.
        owner = payable(msg.sender);
    }

    /// @dev fetches all stored memos
    function getMemos() public view returns (Memo [] memory) {
        return memos;
    }

    /// @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
    /// @param _name name of the coffee purchaser
    /// @param _message a nice message from the purchaser
    function buyCoffee(string memory _name, string memory _message) public payable {
        /// Must accept more than 0 ETH for a coffee
        require(msg.value > 0, "Can't buy coffee for free!");

        /// Add the memo to storage
        memos.push(
            Memo(msg.sender,
            block.timestamp,
            _name,
            _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /// @dev send the entire balance stored in this contract to the owner.
    function withdrawTips()public {
        require(owner.send(address(this).balance));
    }

    /// @dev Update withdrawal address.
    function changeOwnerAddress (address _newOwnerAddress) public {
        require(owner == msg.sender, "Only contract owner can change owner address");
        owner = payable(_newOwnerAddress);
    }
}