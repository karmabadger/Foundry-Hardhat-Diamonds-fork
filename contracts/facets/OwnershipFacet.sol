// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC173 } from "../interfaces/IERC173.sol";
import { LibOwnership, NotDiamondOwner } from "../libraries/LibOwnership.sol";
import {IDiamondInit} from "../interfaces/IDiamondInit.sol";

abstract contract OwnershipModifers {
  modifier onlyOwner() {
    if (msg.sender != LibOwnership.diamondStorage().contractOwner) revert NotDiamondOwner();
    _;
  }
}

contract OwnershipFacet is IERC173, OwnershipModifers {
  function transferOwnership(address _newOwner) external override {
    LibOwnership.enforceIsContractOwner();
    LibOwnership.setContractOwner(_newOwner);
  }

  function owner() external view override returns (address owner_) {
    owner_ = LibOwnership.contractOwner();
  }
}

contract OwnershipDiamondInit is IDiamondInit {
  function init() external {
    LibOwnership.setContractOwner(msg.sender);
  }
}
