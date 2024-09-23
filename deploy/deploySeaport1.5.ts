import * as hre from "hardhat";
import { deployContract, getWallet } from "./utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000001";
const CONDUIT_CONTROLLER_ADDRESS = "0xd2529C5F1978Efcdb14350E9dAD433852FD94A35"

export default async function () {
  await deploySeaportV1_5();
}

const deploySeaportV1_5 = async () => {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const conduitController = await deployContract(
    "contracts/seaport-1.5/conduit/ConduitController.sol:ConduitController",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
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
    console.error(JSON.stringify(error));
    process.exit(1);
  });

  const seaportAddress = await seaport.getAddress();
  console.log(`Seaport 1.5 deployed to address ${seaportAddress}`);
}