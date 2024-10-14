import { deployContract } from './utils';
import { DeploymentType } from "zksync-ethers/build/types";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const DEPLOY_V3_CORE_FACTORY = async () => {
  const contract = await deployContract(
    'UniswapV3Factory',
    "create2" as DeploymentType,
    [],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );
  return { v3CoreFactoryAddress: await contract.getAddress() };
};

export const DEPLOY_MULTICALL2 = async () => {
  const contract = await deployContract(
    'UniswapInterfaceMulticall',
    "create2" as DeploymentType,
    [],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );
  return { multicall2Address: await contract.getAddress() };
};

export const DEPLOY_PROXY_ADMIN = async () => {
  const contract = await deployContract(
    'ProxyAdmin',
    "create2" as DeploymentType,
    [],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );
  return { proxyAdminAddress: await contract.getAddress() };
};

export const DEPLOY_TICK_LENS = async () => {
  const contract = await deployContract(
    'TickLens',
    "create2" as DeploymentType,
    [],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );
  return { tickLensAddress: await contract.getAddress() };
};