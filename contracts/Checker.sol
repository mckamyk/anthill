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
  function decimals(address base, address quote) virtual public view returns (uint8 decs);
}

abstract contract Token {
  function balanceOf(address) virtual public view returns (uint);
}


contract Checker {
  FeedRegistry internal registry;
  address manager;
  address ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

  address public constant USD = address(840);

  constructor(address _chainLinkRegistryAddress) {
    registry = FeedRegistry(_chainLinkRegistryAddress);
    manager = msg.sender;
    console.log("Created registry at %s", _chainLinkRegistryAddress);
  }

  struct BalanceResponse {
    address addr;
    uint balance;
    bool error;
  }

  function getBalances(address user, address[] calldata coins) public view returns (BalanceResponse[] memory) {
    BalanceResponse[] memory balances = new BalanceResponse[](coins.length);

    for (uint i = 0; i < coins.length; i++) {
      if (coins[i] != address(0x0) ) {
        address coin = coins[i];

        if (coins[i] == ETH_ADDRESS) {
          balances[i] = BalanceResponse({addr: coin, balance: user.balance, error: false});
        }

        uint size;
        assembly { size := extcodesize(coin)}
        if (size > 0) {
          Token t = Token(coin);
          try t.balanceOf(user) returns (uint bal) {
            balances[i] = BalanceResponse({ addr: coin, balance: bal, error: false});
          } catch (bytes memory /*error*/ ) {
            balances[i] = BalanceResponse({ addr: coin, balance: 0, error: true});
          }
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

  function checkPrice(address token) public view returns (int formattedPrice) {
    try registry.decimals(token, USD) returns (uint8 decimals) {
      try registry.latestRoundData(token, USD) returns (uint80, int price, uint, uint, uint80) {
        return price / int(10**decimals);
      } catch (bytes memory) {
        console.log("error getting price of %s", token);
        return 0;
      }
    } catch (bytes memory) {
      console.log("error getting decimals of %s", token);
    }
  }
}
