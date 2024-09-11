import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

export default async function () {
  await deploySeaportV1_5();
}
  
const deploySeaportV1_5 = async () => {
  const conduitController = await deployContract(
    "contracts/seaport-1.5/conduit/ConduitController.sol:ConduitController",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
    customData: {
    salt: salt
    }}
  );

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
    }}
  ).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  const seaportAddress = await seaport.getAddress();
  console.log(`Seaport deployed to address ${seaportAddress}`);
}