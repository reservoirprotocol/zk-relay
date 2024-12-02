import { deployUniV2 } from "./utils";
import * as hre from "hardhat";
import UniswapV2Factory from "@uniswap/v2-core/artifacts-zk/contracts/UniswapV2Factory.sol/UniswapV2Factory.json";
import UniswapV2Pair from "@uniswap/v2-core/artifacts-zk/contracts/UniswapV2Pair.sol/UniswapV2Pair.json";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/dist/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000003";

export default async function () {
  await deployUniV2(hre,
    UniswapV2Factory as unknown as ZkSyncArtifact,
    UniswapV2Pair as unknown as ZkSyncArtifact,
    ["0xf3d63166F0Ca56C3c1A3508FcE03Ff0Cf3Fb691e"],
    {},
    "create2",
    {
      customData: {
        salt: salt
      }
    });
}

// const deployUniV2 = async () => {
//   await deployArtifact(
//     UniswapV2Factory as unknown as ZkSyncArtifact,
//     "create2" as DeploymentType,
//     ["0xf3d63166F0Ca56C3c1A3508FcE03Ff0Cf3Fb691e"], // constructorArguments (empty array if there are no constructor arguments)
//     {}, // options (empty object if no options are needed)
//     {
//       customData: {
//         salt: salt
//       }
//     },
//     [UniswapV2Pair.bytecode]
//   ).catch((error) => {
//     console.error(JSON.stringify(error));
//     process.exit(1);
//   });
// }

