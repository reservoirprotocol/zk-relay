import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";
const CONDUIT_CONTROLLER_ADDRESS = "0xee8810654aDd44297Cb0508288F6C2050890FC81"

export default async function () {
  await deploySeaportContracts();
}

const deploySeaportContracts = async () => {
  // Uncomment this block if you want to deploy ConduitController
  // Else update CONDUIT_CONTROLLER_ADDRESS with the deployed ConduitController address

  // const conduitController = await deployContract(
  //   "contracts/seaport-1.5/conduit/ConduitController.sol:ConduitController",
  //   "create2" as DeploymentType,
  //   [], // constructorArguments (empty array if there are no constructor arguments)
  //   {}, // options (empty object if no options are needed)
  //   {
  //     customData: {
  //       salt: salt
  //     }
  //   }
  // ).catch((error) => {
  //   console.error(JSON.stringify(error));
  //   process.exit(1);
  // });

  // const conduitControllerAddress = await conduitController.getAddress();
  // console.log(
  //   `ConduitController deployed to address ${conduitControllerAddress}`
  // );

  const seaportV1_5 = await deployContract(
    "contracts/seaport-1.5/Seaport.sol:Seaport",
    "create2" as DeploymentType,
    [CONDUIT_CONTROLLER_ADDRESS], // constructorArguments (empty array if there are no constructor arguments)
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

  const seaportV1_5Address = await seaportV1_5.getAddress();
  console.log(`Seaport 1.5 deployed to address ${seaportV1_5Address}`);


  const seaportV1_6 = await deployContract(
    "contracts/seaport-1.6/Seaport.sol:Seaport",
    "create2" as DeploymentType,
    [CONDUIT_CONTROLLER_ADDRESS], // constructorArguments (empty array if there are no constructor arguments)
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

  const seaportV1_6Address = await seaportV1_6.getAddress();
  console.log(`Seaport 1.6 deployed to address ${seaportV1_6Address}`);
}