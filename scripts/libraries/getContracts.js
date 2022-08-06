"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const getContractsRecursive = async (dir) => {
    const dirents = await fs_1.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path_1.default.resolve(dir, dirent.name);
        return dirent.isDirectory()
            ? getContracts(res)
            : {
                path: res,
                dirent,
                contractName: dirent.name.endsWith(".json")
                    ? dirent.name.slice(0, dirent.name.length - 5)
                    : dirent.name,
                contractFileName: dir,
            };
    }));
    return Array.prototype.concat(...files);
};
const getContracts = async (dir) => {
    return (await getContractsRecursive(dir));
};
exports.default = getContracts;
