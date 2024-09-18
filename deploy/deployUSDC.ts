import { ethers } from 'ethers';
import { deployContract, getProvider, getWallet } from './utils'
import { LOCAL_RICH_WALLETS } from './utils';

const tokenName = 'USDC';
const tokenSymbol = 'USDC';
const tokenCurrency = 'USD';
const DECIMALS = 6;
const THROWAWAY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Use actual throwaway address
const FIAT_TOKEN_OWNER = "0xf3d63166F0Ca56C3c1A3508FcE03Ff0Cf3Fb691e";
const PROXY_ADMIN = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049";
const MASTER_MINTER_OWNER = "0xf3d63166F0Ca56C3c1A3508FcE03Ff0Cf3Fb691e";

/// Recent Deployments
const PROXY_ADDRESS = "0xe4C7fBB0a626ed208021ccabA6Be1566905E2dFc";
const IMPL_ADDRESS = "0x22F4D93be0E8C0C081e74c0d5e697B64eEA007FF"
const MASTER_MINTER_ADDRESS = "0x97b985951FD3e0C1d996421CC783d46c12d00082";

export default async function () {
  await deployTokenContracts();
}

const deployTokenContracts = async () => {
  // // const provider = getProvider();
  const deployer = getWallet();
  const fiatTokenV2_2Abi = require('../artifacts-zk/contracts/usdc/v2/FiatTokenV2_2.sol/FiatTokenV2_2.json').abi;

  // Deploy FiatTokenV2_2 implementation
  const fiatTokenV2_2 = await deployContract('FiatTokenV2_2', 'create', []);
  const fiatTokenV2_2Address = await fiatTokenV2_2.getAddress();

  // Deploy FiatTokenProxy with FiatTokenV2_2's address
  const proxy = await deployContract('FiatTokenProxy', 'create', [fiatTokenV2_2Address]);
  const proxyAddress = await proxy.getAddress();

  // Deploy MasterMinter with the proxy address
  const masterMinter = await deployContract('MasterMinter', 'create', [proxyAddress]);

  // Transfer ownership of MasterMinter to masterMinterOwner
  await masterMinter.transferOwnership(MASTER_MINTER_OWNER);
  const masterMinterAddress = await masterMinter.getAddress();

  // Change the proxy admin to proxyAdmin
  await proxy.changeAdmin(PROXY_ADMIN);

  // Initialize the proxy (V1 initialization) as FiatTokenV2_2
  const proxyAsV2_2 = new ethers.Contract(proxyAddress, fiatTokenV2_2Abi, deployer);

  console.log("Initialize the proxy");
  await proxyAsV2_2.initialize(
    tokenName,
    tokenSymbol,
    tokenCurrency,
    6,
    masterMinterAddress,
    FIAT_TOKEN_OWNER, // pauser
    FIAT_TOKEN_OWNER, // blacklister
    FIAT_TOKEN_OWNER // owner
  ).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  console.log("Initialize the proxy (V2 initialization)");
  await proxyAsV2_2.initializeV2(tokenName).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  console.log("Initialize the proxy (V2_1 initialization)");
  await proxyAsV2_2.initializeV2_1(FIAT_TOKEN_OWNER).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });

  console.log("Initialize the proxy (V2_2 initialization)");
  await proxyAsV2_2.initializeV2_2([], tokenSymbol).catch((error) => {
    console.error(JSON.stringify(error.info._error.error));
    process.exit(1);
  });
}
