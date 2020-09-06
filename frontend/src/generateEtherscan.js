export default function generateEtherscan(txHash) {
  let result = "https://";

  if (global._env_.REACT_APP_ETHER_NETWORK !== "mainnet") {
    result = result + global._env_.REACT_APP_ETHER_NETWORK + ".";
  }

  return `${result}etherscan.io/tx/${txHash}`;
}
