import { deployContract, getWallet } from '../utils';
import { ADD_1BP_FEE_TIER, DEPLOY_MULTICALL2, DEPLOY_V3_CORE_FACTORY } from './steps';
import { DeploymentType } from "zksync-ethers/build/types";

export default async function () {
  const v3FactoryAddress = await DEPLOY_V3_CORE_FACTORY();
  await ADD_1BP_FEE_TIER(v3FactoryAddress);
  await DEPLOY_MULTICALL2();
}
