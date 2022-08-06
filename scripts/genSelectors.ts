import { ContractFactory, utils } from "ethers";
import path from "path/posix";

import getContracts, { ContractFileInfo } from "./libraries/getContracts";

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log(`please supply the correct parameters:
    facetName
  `);
  process.exit(1);
}

async function printSelectors(
  contractName: string,
  artifactFolderPath: string = "./out",
  contractFileName?: string
) {
  const contracts = await getContracts(artifactFolderPath);
  const contractNameToFileMap: Map<string, ContractFileInfo[]> = new Map();
  for (const contract of contracts) {
    if (!contractNameToFileMap.has(contract.contractName)) {
      contractNameToFileMap.set(contract.contractName, []);
    }
    contractNameToFileMap.get(contract.contractName)?.push(contract);
  }

  const contractInfos = contractNameToFileMap.get(contractName);
  if (!contractInfos || contractInfos.length === 0) {
    console.log(`contract ${contractName} not found`);
    process.exit(1);
  }

  const contractInfo = (() => {
    if (contractFileName) {
      const contractInfo = contractInfos.find((contractInfo) => {
        return (
          contractInfo.contractFileName === contractFileName &&
          contractInfo.contractName === contractName
        );
      });
      if (!contractInfo) {
        throw new Error(
          `contract ${contractFileName}:${contractName} not found`
        );
      }
      return contractInfo;
    } else {
      const contractInfoFiltered = contractInfos.filter((contractInfo) => {
        return contractInfo.contractName === contractName;
      });
      if (!contractInfoFiltered || contractInfoFiltered.length === 0) {
        throw new Error(`contract ${contractName} not found`);
      }
      if (contractInfoFiltered.length > 1) {
        throw new Error(
          `contract ${contractName} is ambiguous. please specify the contract file name`
        );
      }
      return contractInfoFiltered[0];
    }
  })();

  const contractFilePath = contractInfo.path;

  // const contractFilePath = path.join(
  //   artifactFolderPath,
  //   `${contractName}.sol`,
  //   `${contractName}.json`
  // );
  const contractArtifact = require(contractFilePath);
  const abi = contractArtifact.abi;
  const bytecode = contractArtifact.bytecode;
  const target = new ContractFactory(abi, bytecode);
  const signatures = Object.keys(target.interface.functions);

  const selectors = signatures.reduce((acc: string[], val) => {
    if (val !== "init(bytes)") {
      acc.push(target.interface.getSighash(val));
    }
    return acc;
  }, []);

  const coder = utils.defaultAbiCoder;
  const coded = coder.encode(["bytes4[]"], [selectors]);

  process.stdout.write(coded);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
printSelectors(args[0], args[1], args[2])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
