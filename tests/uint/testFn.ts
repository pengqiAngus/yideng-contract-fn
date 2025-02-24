// 辅助函数：截断地址
import type { BigNumber } from "@ethersproject/bignumber";
export const truncateAddress = (address: string) => {
  if (!address) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// 辅助函数：格式化 ETH 余额
export const formatBalance = (balance: BigNumber) => {
  const formatted = balance;
  // 只保留 4 位小数
  return Number(formatted).toFixed(4) + "ETH";
};
