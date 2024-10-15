import { deployContract, getWallet } from '../utils';
import * as ProxyAdmin from "../../artifacts-zk/uniswap-zksync-v3/proxy/ProxyAdmin.sol/ProxyAdmin.json"
import * as UniswapV3Factory from "../../artifacts-zk/uniswap-zksync-v3/UniswapV3Factory.sol/UniswapV3Factory.json";
import { DeploymentType } from "zksync-ethers/build/types";
import { Contract } from "zksync-ethers";

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

const ONE_BP_FEE = 100;
const ONE_BP_TICK_SPACING = 1;

const ONE_MINUTE_SECONDS = 60;
const ONE_HOUR_SECONDS = ONE_MINUTE_SECONDS * 60;
const ONE_DAY_SECONDS = ONE_HOUR_SECONDS * 24;
const ONE_MONTH_SECONDS = ONE_DAY_SECONDS * 30;
const ONE_YEAR_SECONDS = ONE_DAY_SECONDS * 365;

const MAX_INCENTIVE_START_LEAD_TIME = ONE_MONTH_SECONDS;
const MAX_INCENTIVE_DURATION = ONE_YEAR_SECONDS * 2;


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
  const v3CoreFactoryAddress = await contract.getAddress();
  return v3CoreFactoryAddress;
};

export const ADD_1BP_FEE_TIER = async (v3CoreFactoryAddress: string) => {
  const wallet = getWallet();

  const v3CoreFactory = new Contract(v3CoreFactoryAddress, UniswapV3Factory.abi, wallet);

  const owner = await v3CoreFactory.owner();
  if (owner.toLowerCase() !== (await wallet.getAddress()).toLowerCase()) {
    throw new Error('UniswapV3Factory.owner is not signer');
  }

  const tx = await v3CoreFactory.enableFeeAmount(ONE_BP_FEE, ONE_BP_TICK_SPACING);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  return [
    {
      message: `UniswapV3Factory added a new fee tier ${ONE_BP_FEE / 100} bps with tick spacing ${ONE_BP_TICK_SPACING}`,
      hash: receipt.transactionHash,
    },
  ];
}

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
  return await contract.getAddress();
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
  return await contract.getAddress();
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
  return await contract.getAddress();
};

export const DEPLOY_NFT_DESCRIPTOR_LIBRARY_V1_3_0 = async () => {
  const contract = await deployContract(
    'NFTDescriptor',
    "create2" as DeploymentType,
    [],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );
  return await contract.getAddress();
};

export const DEPLOY_NFT_POSITION_DESCRIPTOR_V1_3_0 = async () => {
  const contract = await deployContract(
    'NonfungibleTokenPositionDescriptor',
    "create2" as DeploymentType,
    [],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );
  return await contract.getAddress();
};

export const DEPLOY_TRANSPARENT_PROXY_DESCRIPTOR = async (nonfungibleTokenPositionDescriptorAddressV1_3_0: string, proxyAdminAddress: string) => {
  const contract = await deployContract(
    'TransparentUpgradeableProxy',
    "create2" as DeploymentType,
    [nonfungibleTokenPositionDescriptorAddressV1_3_0, proxyAdminAddress, '0x'],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );

  return await contract.getAddress();
};

export const DEPLOY_NONFUNGIBLE_POSITION_MANAGER = async (v3CoreFactoryAddress: string, weth9Address: string, descriptorProxyAddress: string) => {
  const contract = await deployContract(
    'NonfungiblePositionManager',
    "create2" as DeploymentType,
    [v3CoreFactoryAddress, weth9Address, descriptorProxyAddress]
  );

  return await contract.getAddress();
};

export const DEPLOY_V3_MIGRATOR = async (v3CoreFactoryAddress: string, weth9Address: string, nonfungibleTokenPositionManagerAddress: string) => {
  const contract = await deployContract(
    'V3Migrator',
    "create2" as DeploymentType,
    [v3CoreFactoryAddress, weth9Address, nonfungibleTokenPositionManagerAddress]
  );

  return await contract.getAddress();
};

export const TRANSFER_V3_CORE_FACTORY_OWNER = async (v3CoreFactoryAddress: string, ownerAddress: string) => {
  const wallet = getWallet();

  const v3CoreFactory = new Contract(v3CoreFactoryAddress, UniswapV3Factory.abi, wallet);

  const owner = await v3CoreFactory.owner();
  if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
    return [{ message: `UniswapV3Factory owned by ${ownerAddress} already` }];
  }

  if (owner.toLowerCase() !== (await wallet.getAddress()).toLowerCase()) {
    throw new Error('UniswapV3Factory.owner is not signer');
  }

  const tx = await v3CoreFactory.setOwner(ownerAddress);
  const receipt = await tx.wait();

  return [{ message: `UniswapV3Factory ownership set to ${ownerAddress}`, hash: receipt.transactionHash }];
};

export const DEPLOY_V3_STAKER = async (v3CoreFactoryAddress: string, nonfungibleTokenPositionManagerAddress: string) => {
  const contract = await deployContract(
    'UniswapV3Staker',
    "create2" as DeploymentType,
    [
      v3CoreFactoryAddress,
      nonfungibleTokenPositionManagerAddress,
      MAX_INCENTIVE_START_LEAD_TIME,
      MAX_INCENTIVE_DURATION,
    ],
    {},
    {
      customData: {
        salt: salt
      }
    }
  );

  return await contract.getAddress();
};

export const DEPLOY_QUOTER_V2 = async (v3CoreFactoryAddress: string, weth9Address: string) => {
  if (v3CoreFactoryAddress === undefined) {
    throw new Error('Missing V3 Core Factory');
  }

  const contract = await deployContract(
    'QuoterV2',
    "create2" as DeploymentType,
    [v3CoreFactoryAddress, weth9Address]
  );

  return await contract.getAddress();
};

export const DEPLOY_V3_SWAP_ROUTER_02 = async (v3CoreFactoryAddress: string, v2CoreFactoryAddress: string, weth9Address: string, nonfungibleTokenPositionManagerAddress: string) => {
  const contract = await deployContract(
    'SwapRouter02',
    "create2" as DeploymentType,
    [
      v2CoreFactoryAddress,
      v3CoreFactoryAddress,
      nonfungibleTokenPositionManagerAddress,
      weth9Address,
    ]
  );

  return { swapRouter02: await contract.getAddress() };
};

export const TRANSFER_PROXY_ADMIN = async (proxyAdminAddress: string, ownerAddress: string) => {
  const wallet = getWallet();

  const proxyAdmin = new Contract(proxyAdminAddress, ProxyAdmin.abi, wallet);

  const owner = await proxyAdmin.owner();
  if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
    return [{ message: `ProxyAdmin owned by ${ownerAddress} already` }];
  }

  if (owner.toLowerCase() !== (await wallet.getAddress()).toLowerCase()) {
    throw new Error('ProxyAdmin.owner is not signer');
  }

  const tx = await proxyAdmin.transferOwnership(ownerAddress);
  const receipt = await tx.wait();

  return [{ message: `ProxyAdmin ownership set to ${ownerAddress}`, hash: receipt.transactionHash }];
};