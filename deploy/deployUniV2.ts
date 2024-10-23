import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

export default async function () {
  await deployUniV2();
}

const deployUniV2 = async () => {
  await deployContract(
    "UniswapV2Factory",
    "create2" as DeploymentType,
    ["0xf3d63166F0Ca56C3c1A3508FcE03Ff0Cf3Fb691e"], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
        salt: salt
      }
    }
  ).catch((error) => {
    console.error(JSON.stringify(error));
    process.exit(1);
  });
}

