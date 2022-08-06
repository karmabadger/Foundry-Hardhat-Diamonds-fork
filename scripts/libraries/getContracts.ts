import { Dirent, promises as fs } from "fs";
import path from "path";

type ContractFileInfo = {
  path: string;
  dirent: Dirent;
  contractName: string;
  contractFileName: string;
};
const getContractsRecursive = async (
  dir: string
): Promise<(ContractFileInfo | Dirent)[]> => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
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
    })
  );
  return Array.prototype.concat(...files);
};

const getContracts = async (dir: string): Promise<ContractFileInfo[]> => {
  return (await getContractsRecursive(dir)) as ContractFileInfo[];
};

export default getContracts;
export { ContractFileInfo };
