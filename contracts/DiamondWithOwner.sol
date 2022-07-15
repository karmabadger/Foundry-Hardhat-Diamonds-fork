// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Diamond.sol";
import {LibOwnership} from "./libraries/LibOwnership.sol";

contract DiamondWithOwner is Diamond {
  constructor(address _owner, address _diamondCutFacet) Diamond(_diamondCutFacet) {
    LibOwnership.setContractOwner(_owner);
  }
}