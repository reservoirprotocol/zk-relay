import { deployContract } from "./utils";
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000001";

const PERMIT2 = "0x6b4420f66De496D18A6c36367cf7f1440fd9289f"
const SOLVER = "0xf70da97812CB96acDF810712Aa562db8dfA3dbEF"
const TESTNET_SOLVER = "0x3e34b27a9bf37D8424e1a58aC7fc4D06914B76B9"
const ROUTER = '0xaC4EdF9f8cdE86b811e3aa821055c0E8D680cDa8'

export default async function () {
  const multicallerAddress = await deployMulticaller();
  const routerAddress = await deployErc20Router(multicallerAddress);
  await deployApprovalProxy(ROUTER);
  await deployOnlyOwnerMulticaller();
  await deployRelayReceiver(SOLVER);
  await deployMulticall3();
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
      }
    }
  );

  const multicallerAddress = await multicaller.getAddress();

  return multicallerAddress;
}

const deployOnlyOwnerMulticaller = async () => {
  const onlyOwnerMulticaller = await deployContract(
    "OnlyOwnerMulticaller",
    "create2" as DeploymentType,
    [SOLVER], // constructorArguments (empty array if there are no constructor arguments)
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
}

const deployApprovalProxy = async (erc20Router: string) => {
  const approvalProxy = await deployContract(
    "ApprovalProxy",
    "create2" as DeploymentType,
    [SOLVER, erc20Router], // constructorArguments (empty array if there are no constructor arguments)
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

  const approvalProxyAddress = await approvalProxy.getAddress();

  return approvalProxyAddress;
}

const deployErc20Router = async (multicallerAddress: string) => {
  const erc20Router = await deployContract(
    "ERC20Router",
    "create2" as DeploymentType,
    [PERMIT2, multicallerAddress, SOLVER], // constructorArguments (empty array if there are no constructor arguments)
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

  const erc20RouterAddress = await erc20Router.getAddress();

  return erc20RouterAddress;
}

const deployRelayReceiver = async (solver: string) => {
  const relayReceiver = await deployContract(
    "RelayReceiver",
    "create2" as DeploymentType,
    [solver], // constructorArguments (empty array if there are no constructor arguments)
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

  const relayReceiverAddress = await relayReceiver.getAddress();

  return relayReceiverAddress;
}

const deployMulticall3 = async () => {
  const multicall3 = await deployContract(
    "Multicall3",
    "create2" as DeploymentType,
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
        salt: salt
      }
    }
  );

  const multicall3Address = await multicall3.getAddress();

  return multicall3Address;
}
