export default function generateEtherscan(txHash) {
  let result = "https://";

  if (process.env.REACT_APP_ETHER_NETWORK !== "mainnet") {
    result = result + process.env.REACT_APP_ETHER_NETWORK + ".";
  }

  return `${result}etherscan.io/tx/${txHash}`;
}
