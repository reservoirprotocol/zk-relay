import { ADD_1BP_FEE_TIER, DEPLOY_MULTICALL2, DEPLOY_NFT_DESCRIPTOR_LIBRARY_V1_3_0, DEPLOY_NFT_POSITION_DESCRIPTOR_V1_3_0, DEPLOY_NONFUNGIBLE_POSITION_MANAGER, DEPLOY_PROXY_ADMIN, DEPLOY_QUOTER_V2, DEPLOY_TICK_LENS, DEPLOY_TRANSPARENT_PROXY_DESCRIPTOR, DEPLOY_V3_CORE_FACTORY, DEPLOY_V3_MIGRATOR, DEPLOY_V3_STAKER, TRANSFER_V3_CORE_FACTORY_OWNER, DEPLOY_V3_SWAP_ROUTER_02, TRANSFER_PROXY_ADMIN } from './steps';
import { deployWETH9 } from "../deployWeth";
import { deployUniV2 } from '../deployUniV2';

export default async function () {
  const weth9Address = "0xEE6B04fcD07A54D78a7a23f353F2B4a0bfb4a78C";
  const v3FactoryOwner = "0x2BAD8182C09F50c8318d769245beA52C32Be46CD";
  const v2CoreFactory = "0x1B4427e212475B12e62f0f142b8AfEf3BC18B559";
  const proxyOwner = "0x2BAD8182C09F50c8318d769245beA52C32Be46CD";

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

  console.log("V3 Factory Address:", v3FactoryAddress);
  console.log("Multicall2 Address:", multicall2);
  console.log("Proxy Admin Address:", proxyAdmin);
  console.log("Tick Lens Address:", tickLens);
  console.log("NFT Descriptor Library Address:", nftDescriptorLibrary);
  console.log("NFT Position Descriptor Address:", nonfungibleTokenPositionDescriptorAddressV1_3_0);
  console.log("Transparent Proxy Descriptor Address:", transparentProxyDescriptor);
  console.log("Nonfungible Position Manager Address:", nonFungibleTokenPositionManager);
  console.log("V3 Migrator Address:", v3Migrator);
  console.log("Transferred V3 Core Factory Ownership");
  console.log("Staker Address:", staker);
  console.log("Quoter Address:", quoter);
  console.log("Swap Router Address:", swapRouter);
}
