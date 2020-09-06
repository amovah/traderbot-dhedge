import BN from "bn.js";

function generateZeroBN(count) {
  return new BN("1" + "0".repeat(count), 10);
}

export default function convertToBigNumber(number) {
  const stringNumber = number.toString();
  const splitted = stringNumber.split(".");

  if (!splitted[1]) {
    const finalNumber = new BN(number, 10);
    return finalNumber.mul(generateZeroBN(18));
  }

  const finalNumber = new BN(stringNumber.replace(".", ""), 10);
  return finalNumber.mul(generateZeroBN(18 - splitted[1].length));
}
