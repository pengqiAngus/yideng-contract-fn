import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const YidengContractModule = buildModule("YidengContractModule", (m) => {
  const contract = m.contract("YidengContract", ["Yideng Token", "YDT", 18]);

  return { contract };
});

export default YidengContractModule;
