import { deployContract, getWallet } from '../utils';
import { DeploymentType } from "zksync-ethers/build/types";
import { Contract } from "zksync-ethers";

const ONE_BP_FEE = 100;
const ONE_BP_TICK_SPACING = 1;
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

