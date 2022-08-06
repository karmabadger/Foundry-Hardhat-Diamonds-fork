"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const getContracts_1 = __importDefault(require("./libraries/getContracts"));
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log(`please supply the correct parameters:
    facetName
  `);
    process.exit(1);
}
async function printSelectors(contractName, artifactFolderPath = "./out", contractFileName) {
    var _a;
    const contracts = await (0, getContracts_1.default)(artifactFolderPath);
    const contractNameToFileMap = new Map();
    for (const contract of contracts) {
        if (!contractNameToFileMap.has(contract.contractName)) {
            contractNameToFileMap.set(contract.contractName, []);
        }
        (_a = contractNameToFileMap.get(contract.contractName)) === null || _a === void 0 ? void 0 : _a.push(contract);
    }
    const contractInfos = contractNameToFileMap.get(contractName);
    if (!contractInfos || contractInfos.length === 0) {
        console.log(`contract ${contractName} not found`);
        process.exit(1);
    }
    const contractInfo = (() => {
        if (contractFileName) {
            const contractInfo = contractInfos.find((contractInfo) => {
                return (contractInfo.contractFileName === contractFileName &&
                    contractInfo.contractName === contractName);
            });
            if (!contractInfo) {
                throw new Error(`contract ${contractFileName}:${contractName} not found`);
            }
            return contractInfo;
        }
        else {
            const contractInfoFiltered = contractInfos.filter((contractInfo) => {
                return contractInfo.contractName === contractName;
            });
            if (!contractInfoFiltered || contractInfoFiltered.length === 0) {
                throw new Error(`contract ${contractName} not found`);
            }
            if (contractInfoFiltered.length > 1) {
                throw new Error(`contract ${contractName} is ambiguous. please specify the contract file name`);
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
    const target = new ethers_1.ContractFactory(abi, bytecode);
    const signatures = Object.keys(target.interface.functions);
    const selectors = signatures.reduce((acc, val) => {
        if (val !== "init(bytes)") {
            acc.push(target.interface.getSighash(val));
        }
        return acc;
    }, []);
    const coder = ethers_1.utils.defaultAbiCoder;
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
