import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

const PERMIT2 = "0x7d174F25ADcd4157EcB5B3448fEC909AeCB70033"
const MULTICALLER = "0x1903f6E993BbaA21aEf311a3ABF7fF627542d167"
const SOLVER = "0xf70da97812CB96acDF810712Aa562db8dfA3dbEF"
const ERC20ROUTER = "0xad822d7f6Ba100f1a74834E5D3C24B95F1434CbB"

export default async function () {
  // const routerAddress = await deployErc20Router();
  await deployApprovalProxy();
  await deployRelayReceiver();
}

const deployMulticaller = async () => {
  const multicaller = await deployContract(
    "Multicaller",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
    customData: {
    salt: salt
    }}
  );

  const multicallerAddress = await multicaller.getAddress();

  return multicallerAddress;
}

const deployApprovalProxy = async () => {
  const approvalProxy = await deployContract(
    "ApprovalProxy",
    "create2" as DeploymentType,
    [SOLVER, ERC20ROUTER], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );

  const approvalProxyAddress = await approvalProxy.getAddress();

  return approvalProxyAddress;
}

const deployErc20Router = async () => {
  const erc20Router = await deployContract(
    "ERC20Router",
    "create2" as DeploymentType,
    [PERMIT2, MULTICALLER, SOLVER], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  ).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  const erc20RouterAddress = await erc20Router.getAddress();

  return erc20RouterAddress;
}

const deployRelayReceiver = async () => {
  const relayReceiver = await deployContract(
    "RelayReceiver",
    "create2" as DeploymentType,
    [SOLVER], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
      salt: salt
    }}
  );

  const relayReceiverAddress = await relayReceiver.getAddress();

  return relayReceiverAddress;
}

