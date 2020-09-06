export default function txNormalizer(txHash) {
  return `${txHash.slice(0, 6)}...${txHash.slice(-6)}`;
}
