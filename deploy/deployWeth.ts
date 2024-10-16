import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

export default async function () {
  await deployWETH9();
}

export const deployWETH9 = async () => {
  const contract = await deployContract(
    "WETH9",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
        salt: salt
      }
    }
  );

  return await contract.getAddress();
}