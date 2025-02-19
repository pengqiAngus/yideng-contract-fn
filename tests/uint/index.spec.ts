import { BigNumber } from "@ethersproject/bignumber";
import { formatBalance, truncateAddress } from "./testFn";

describe("truncateAddress", () => {
  test("should correctly truncate a valid Ethereum address", () => {
    const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    expect(truncateAddress(address)).toBe("0x742d...f44e");
  });

  test("should handle empty string", () => {
    expect(truncateAddress("")).toBe("");
  });

  test("should handle null input", () => {
    expect(truncateAddress(null)).toBe(null);
  });

  test("should handle undefined input", () => {
    expect(truncateAddress(undefined)).toBe(undefined);
  });

  test("should handle short addresses", () => {
    const shortAddress = "0x1234";
    expect(truncateAddress(shortAddress)).toBe("0x1234...1234");
  });
});

describe("formatBalance", () => {
  test("should format whole numbers correctly", () => {
    const balance = BigNumber.from("1000000000000000000"); // 1 ETH
    expect(formatBalance(balance)).toBe("1.0000ETH");
  });

  test("should format decimal numbers correctly", () => {
    const balance = BigNumber.from("1234567890000000000"); // 1.23456789 ETH
    expect(formatBalance(balance)).toBe("1.2346ETH"); // 四舍五入到4位小数
  });

  test("should handle zero balance", () => {
    const balance = BigNumber.from("0");
    expect(formatBalance(balance)).toBe("0.0000ETH");
  });

  test("should handle very small numbers", () => {
    const balance = BigNumber.from("1000000000000"); // 0.000001 ETH
    expect(formatBalance(balance)).toBe("0.0000ETH");
  });

  test("should handle very large numbers", () => {
    const balance = BigNumber.from("123456789000000000000"); // 123.456789 ETH
    expect(formatBalance(balance)).toBe("123.4568ETH");
  });

  test("should maintain exactly 4 decimal places", () => {
    const balance = BigNumber.from("1100000000000000000"); // 1.1 ETH
    expect(formatBalance(balance)).toBe("1.1000ETH");
  });
});
