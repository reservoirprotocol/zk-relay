import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";
const CONDUIT_CONTROLLER_ADDRESS = "0x1972ddFa941670A9F5fa2A0094f4490347B99D7B"

export default async function () {
  await deploySeaportContracts();
}

const deploySeaportContracts = async () => {
  // Uncomment this block if you want to deploy ConduitController
  // Else update CONDUIT_CONTROLLER_ADDRESS with the deployed ConduitController address

  // const conduitController = await deployContract(
  //   "contracts/reference-seaport-1.6/conduit/ReferenceConduitController.sol:ReferenceConduitController",
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
    "contracts/reference-seaport-1.6/Seaport.sol:Seaport",
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