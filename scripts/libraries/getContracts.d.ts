/// <reference types="node" />
import { Dirent } from "fs";
declare type ContractFileInfo = {
    path: string;
    dirent: Dirent;
    contractName: string;
    contractFileName: string;
};
declare const getContracts: (dir: string) => Promise<ContractFileInfo[]>;
export default getContracts;
export { ContractFileInfo };
