import normalizeAmount from "./normalizeAmount";

export default function normalizeBigNumber(number) {
  if (!number) {
    return "0";
  }

  const diff = 18 - number.length;
  if (diff >= 0) {
    return normalizeAmount("0." + "0".repeat(diff) + number);
  }

  return normalizeAmount(
    number.slice(0, diff * -1) + "." + number.slice(diff * -1)
  );
}
