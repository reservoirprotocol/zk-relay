import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

export default async function () {
  await deploySignatureChecker();
}

const deploySignatureChecker = async () => {
  await deployContract(
    "SignatureChecker",
    "create" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {}
  );
}

