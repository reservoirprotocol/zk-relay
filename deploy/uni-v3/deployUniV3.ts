import { deployContract, getWallet } from '../utils';
import { ADD_1BP_FEE_TIER, DEPLOY_MULTICALL2, DEPLOY_NFT_DESCRIPTOR_LIBRARY_V1_3_0, DEPLOY_NFT_POSITION_DESCRIPTOR_V1_3_0, DEPLOY_NONFUNGIBLE_POSITION_MANAGER, DEPLOY_PROXY_ADMIN, DEPLOY_QUOTER_V2, DEPLOY_TICK_LENS, DEPLOY_TRANSPARENT_PROXY_DESCRIPTOR, DEPLOY_V3_CORE_FACTORY, DEPLOY_V3_MIGRATOR, DEPLOY_V3_STAKER, TRANSFER_V3_CORE_FACTORY_OWNER, DEPLOY_V3_SWAP_ROUTER_02, TRANSFER_PROXY_ADMIN } from './steps';
import { DeploymentType } from "zksync-ethers/build/types";

export default async function () {
  const weth9Address = "";
  const v3FactoryOwner = "";
  const v2CoreFactory = "";
  const proxyOwner = "";

  const v3FactoryAddress = await DEPLOY_V3_CORE_FACTORY();
  await ADD_1BP_FEE_TIER(v3FactoryAddress);
  const multicall2 = await DEPLOY_MULTICALL2();
  const proxyAdmin = await DEPLOY_PROXY_ADMIN();
  const tickLens = await DEPLOY_TICK_LENS();
  const nftDescriptorLibrary = await DEPLOY_NFT_DESCRIPTOR_LIBRARY_V1_3_0();
  const nonfungibleTokenPositionDescriptorAddressV1_3_0 = await DEPLOY_NFT_POSITION_DESCRIPTOR_V1_3_0();
  const transparentProxyDescriptor = await DEPLOY_TRANSPARENT_PROXY_DESCRIPTOR(nonfungibleTokenPositionDescriptorAddressV1_3_0, proxyAdmin);
  const nonFungibleTokenPositionManager = await DEPLOY_NONFUNGIBLE_POSITION_MANAGER(v3FactoryAddress, weth9Address, transparentProxyDescriptor);
  const v3Migrator = await DEPLOY_V3_MIGRATOR(v3FactoryAddress, weth9Address, nonFungibleTokenPositionManager);
  await TRANSFER_V3_CORE_FACTORY_OWNER(v3FactoryAddress, v3FactoryOwner);
  const staker = await DEPLOY_V3_STAKER(v3FactoryAddress, nonFungibleTokenPositionManager);
  const quoter = await DEPLOY_QUOTER_V2(v3FactoryAddress, weth9Address);
  const swapRouter = await DEPLOY_V3_SWAP_ROUTER_02(v3FactoryAddress, v2CoreFactory, weth9Address, nonFungibleTokenPositionManager);
  await TRANSFER_PROXY_ADMIN(proxyAdmin, proxyOwner);
}
