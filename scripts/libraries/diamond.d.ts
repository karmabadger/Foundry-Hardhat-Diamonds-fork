import * as ethers from "ethers";
declare const FacetCutAction: {
    Add: number;
    Replace: number;
    Remove: number;
};
declare function getSelectors(contract: ethers.Contract): string[];
declare function getSelector(func: any): string;
declare function remove(this: any, functionNames: string[]): any;
declare function removeSelectors(selectors: any[], signatures: any[]): any[];
declare function findAddressPositionInFacets(facetAddress: any, facets: any): number | undefined;
export { getSelectors, getSelector, FacetCutAction, remove, removeSelectors, findAddressPositionInFacets, };
