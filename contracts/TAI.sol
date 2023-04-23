// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TAI is ERC20, Ownable {
    address public uniswapPairAddress;
    mapping(address => bool) private _timeoutWhitelist;
    mapping(address => uint256) public lastTransfer;

    uint256 public transferTimeout = 18;
    uint8 private _decimals = 9;

    constructor() ERC20("T AI", "TAI") {
        _mint(msg.sender, 100000000 * 10**uint8(_decimals));
    }


    function decimals() public view override returns (uint8) {
      return _decimals;
    }

    function setUniswapPairAddress(address _uniswapPairAddress) external onlyOwner {
        uniswapPairAddress = _uniswapPairAddress;
    }

    function setTransferTimeout(uint8 _transferTimeout) external onlyOwner {
        transferTimeout = _transferTimeout;
    }

    function addToWhitelist(address _address) external onlyOwner {
      require(!_timeoutWhitelist[_address], "Address already set in white list");
        _timeoutWhitelist[_address] = true;
    }

    function removeFromWhitelist(address _address) external onlyOwner {
      require(_timeoutWhitelist[_address], "Address isn't in white list");

        _timeoutWhitelist[_address] = false;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        isAllowedToTransfer(msg.sender, recipient);
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        isAllowedToTransfer(spender, to);
        _transfer(from, to, amount);
        return true;
    }

    function isAllowedToTransfer(address sender, address recipient) internal {
      if (sender == uniswapPairAddress) {
        lastTransfer[recipient] = block.timestamp;
      }

      if (!_timeoutWhitelist[sender] && recipient == uniswapPairAddress) {
       require(block.timestamp >= lastTransfer[sender] + transferTimeout, "lock 18s for prevent front runner bot.");
      }
    }
    
}
