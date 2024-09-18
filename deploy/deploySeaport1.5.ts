import * as hre from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployContract, getWallet } from "./utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { DeploymentType } from "zksync-ethers/build/types";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/src/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000001";
const CONDUIT_CONTROLLER_ADDRESS = "0xbCF4f1C0489729a9569aFB09f705BEaC531AADF4"

export default async function () {
  await deploySeaportV1_5();
}

const deploySeaportV1_5 = async () => {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  // Use updated ConduitController in seaport-1.6
  const conduitController = await deployContract(
    "contracts/seaport-1.6/conduit/ConduitController.sol:ConduitController",
    "create" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {}
  ).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  const conduitControllerAddress = await conduitController.getAddress();
  console.log(
    `ConduitController deployed to address ${conduitControllerAddress}`
  );

  const seaport = await deployContract(
    "contracts/seaport-1.5/Seaport.sol:Seaport",
    "create2" as DeploymentType,
    [conduitControllerAddress], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
        salt: salt
      }
    }
  ).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  const seaportAddress = await seaport.getAddress();
  console.log(`Seaport 1.5 deployed to address ${seaportAddress}`);
}