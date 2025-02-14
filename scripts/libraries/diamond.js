"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAddressPositionInFacets = exports.removeSelectors = exports.remove = exports.FacetCutAction = exports.getSelector = exports.getSelectors = void 0;
const ethers = __importStar(require("ethers"));
const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };
exports.FacetCutAction = FacetCutAction;
// get function selectors from ABI
function getSelectors(contract) {
    const signatures = Object.keys(contract.interface.functions);
    const selectors = signatures.reduce((acc, val) => {
        if (val !== "init(bytes)") {
            acc.push(contract.interface.getSighash(val));
        }
        return acc;
    }, []);
    // selectors.contract = contract
    // selectors.remove = remove
    // selectors.get = get
    return selectors;
}
exports.getSelectors = getSelectors;
// get function selector from function signature
function getSelector(func) {
    const abiInterface = new ethers.utils.Interface([func]);
    return abiInterface.getSighash(ethers.utils.Fragment.from(func));
}
exports.getSelector = getSelector;
// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove(functionNames) {
    const selectors = this.filter((v) => {
        for (const functionName of functionNames) {
            if (v === this.contract.interface.getSighash(functionName)) {
                return false;
            }
        }
        return true;
    });
    // selectors.contract = this.contract
    // selectors.remove = this.remove
    // selectors.get = this.get
    return selectors;
}
exports.remove = remove;
// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get(functionNames) {
    const selectors = this.filter((v) => {
        for (const functionName of functionNames) {
            if (v === this.contract.interface.getSighash(functionName)) {
                return true;
            }
        }
        return false;
    });
    // selectors.contract = this.contract
    // selectors.remove = this.remove
    // selectors.get = this.get
    return selectors;
}
// remove selectors using an array of signatures
function removeSelectors(selectors, signatures) {
    const iface = new ethers.utils.Interface(signatures.map((v) => "function " + v));
    const removeSelectors = signatures.map((v) => iface.getSighash(v));
    selectors = selectors.filter((v) => !removeSelectors.includes(v));
    return selectors;
}
exports.removeSelectors = removeSelectors;
// find a particular address position in the return value of diamondLoupeFacet.facets()
function findAddressPositionInFacets(facetAddress, facets) {
    for (let i = 0; i < facets.length; i++) {
        if (facets[i].facetAddress === facetAddress) {
            return i;
        }
    }
}
exports.findAddressPositionInFacets = findAddressPositionInFacets;
