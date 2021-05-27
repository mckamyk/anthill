//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;
import "hardhat/console.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';

abstract contract Token {
  function balanceOf(address) virtual public view returns (uint);
}

contract Checker {
  struct BalanceResponse {
    address addr;
    uint balance;
    bool error;
  }

  function getBalances(address user, address[] calldata coins) public view returns (BalanceResponse[] memory) {
    BalanceResponse[] memory balances = new BalanceResponse[](coins.length);

    for (uint i = 0; i < coins.length; i++) {
      if (coins[i] != address(0x0)) {
        address coin = coins[i];

        Token t = Token(coin);
        try t.balanceOf(user) returns (uint bal) {
          balances[i] = BalanceResponse({ addr: coin, balance: bal, error: false});
        } catch (bytes memory /*error*/ ) {
          balances[i] = BalanceResponse({ addr: coin, balance: 0, error: true});
        }
      }
    }

    return balances;
  }
}