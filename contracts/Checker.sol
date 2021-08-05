//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;
import "hardhat/console.sol";

struct PriceData {
  uint80 roundId;
  int price;
  uint startedAt;
  uint timeStamp;
  uint80 answeredInRound;
}

abstract contract FeedRegistry {
  function latestRoundData(address base, address quote) virtual public view returns (uint80 roundId, int price, uint startedAt, uint timeStamp, uint80 answeredInRound);
}

abstract contract Token {
  function balanceOf(address) virtual public view returns (uint);
}

contract Checker {
  FeedRegistry internal registry;
  address manager;

  address public constant USD = address(840);

  constructor(address _chainLinkRegistryAddress) {
    registry = FeedRegistry(_chainLinkRegistryAddress);
    manager = msg.sender;
    console.log("Created registry at %s", _chainLinkRegistryAddress);
    console.log("foo");
    console.log("bar");
    console.log("bin");
  }

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

  struct BalancePriceResponse {
    address addr;
    uint balance;
    int price;
    bool error;
  }

  function getBalancePrices(address user, address[] calldata coins) public view returns (BalancePriceResponse[] memory) {
    BalanceResponse[] memory bals = getBalances(user, coins);
    BalancePriceResponse[] memory prices = new BalancePriceResponse[](bals.length);

    for (uint i = 0; i < bals.length; i++) {
      prices[i] = BalancePriceResponse({
        addr: bals[i].addr,
        balance: bals[i].balance,
        error: bals[i].error,
        price: 0
      });
      if (bals[i].balance > 0) {
        prices[i].price = checkPrice(bals[i].addr);
      }
    }

    return prices;
  }

  function checkPrice(address token) public view returns (int) {
    try registry.latestRoundData(USD, token) returns (uint80 /*roundId*/, int price, uint /*startedAt*/, uint /*timeStamp*/, uint80 /*answeredInRound*/) {
      return price;
    } catch (bytes memory) {
      console.log("error getting price of %s", token);
      return 0;
    }
  }
}
