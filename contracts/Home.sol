//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Home {
  address public owner;
  string public message;

  event MessageUpdated(string message);

  constructor() {
    owner = msg.sender;
    message = 'Hello';
  }

  function setMessage(string memory _message) public {
    message = _message;
    emit MessageUpdated(message);
  }
}
