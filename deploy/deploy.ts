import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

export default async function () {
  
}
const salt = "0x0000000000000000000000000000000000000000000000000000000000000001";

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
  await deployContract(
    "Seaport",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );
}
