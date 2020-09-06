import smartContract from "./smartContract";
import Web3 from "web3";

export default function getFund() {
  return smartContract.methods
    .getFundComposition()
    .call()
    .then((res) => {
      const result = [];
      for (const [index, item] of res[0].entries()) {
        result.push({
          token: Web3.utils.toUtf8(item),
          amount: res[1][index],
        });
      }

      return result;
    });
}
