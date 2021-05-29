//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;
import "hardhat/console.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';

abstract contract Token {
  function balanceOf(address) virtual public view returns (uint);
}

contract Checker {
  address public UniswapFactoryAddress;
  address public manager;

  constructor(address _uniswapAddress) {
    UniswapFactoryAddress = _uniswapAddress;
    manager = msg.sender;
  }

  function setUniswapFactory(address uniswapFactor) public {
    UniswapFactoryAddress = uniswapFactor;
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
    uint price;
    bool error;
  }

  function getBalancePrices(address user, address[] calldata coins, address priceBase) public view returns (BalancePriceResponse[] memory) {
    BalanceResponse[] memory bals = getBalances(user, coins);
    BalancePriceResponse[] memory prices = new BalancePriceResponse[](bals.length);

    for (uint i = 0; i < bals.length; i++) {
      prices[i] = BalancePriceResponse({
        addr: bals[i].addr,
        balance: bals[i].balance,
        error: bals[i].error,
        price: checkPrice(priceBase, bals[i].addr)
      });
    }

    return prices;
  }

  function checkPrice(address base, address token) public view returns (uint price) {
    address pairAddress = IUniswapV2Factory(UniswapFactoryAddress).getPair(base, token);
    if (pairAddress == address(0)) {
      console.log("Pair %s and %s doesn't exist.", base, token);
      return 0;
    }
    IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
    (uint baseRes, uint tokenRes, ) = pair.getReserves();
    require(baseRes > 0 && tokenRes > 0, "Bad liquidity.");

    return tokenRes/baseRes;
  }
}
