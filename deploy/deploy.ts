import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

export default async function () {
  await deploySeaportV1_6();
}

const salt = "0x0000000000000000000000000000000000000000000000000000000000000004";

const deployWETH9 = async () => {
  await deployContract(
    "WETH9",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );
}

const deployPermit2 = async () => {
  await deployContract(
    "Permit2",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );
}

const deployConduitController = async () => {
  await deployContract(
    "ConduitController",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );
}

const deploySeaportV1_6 = async () => {
  const conduitController = await deployContract(
    "contracts/seaport-1.6/conduit/ConduitController.sol:ConduitController",
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
    "contracts/seaport-1.6/Seaport.sol:Seaport",
    "create2" as DeploymentType,
    [conduitControllerAddress], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );
  console.log(`Seaport deployed to address ${seaport.getAddress()}`);
}
