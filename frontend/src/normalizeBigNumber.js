import normalizeAmount from "./normalizeAmount";

export default function normalizeBigNumber(number, zeros = 18) {
  if (!number) {
    return "0";
  }

  const diff = zeros - number.length;
  if (diff >= 0) {
    return normalizeAmount("0." + "0".repeat(diff) + number);
  }

  return normalizeAmount(
    number.slice(0, diff * -1) + "." + number.slice(diff * -1)
  );
}
