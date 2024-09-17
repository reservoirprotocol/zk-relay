import { ethers } from 'ethers';
import { deployContract, getWallet } from './utils'

const THROWAWAY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Use actual throwaway address
const OWNER = "0xA68d33C51b29394C0ce4Eb698ee50CCfB0877388";
const FIAT_TOKEN_V2_2 = "0xEbf73C99606A29142C71fD24b5421393d0D85167"

export default async function () {
  const proxyAddress = await deployFiatTokenProxy(FIAT_TOKEN_V2_2);
  await deployMasterMinter(proxyAddress);
}

const deployFiatTokenImpl = async () => {
  // Deploy new FiatTokenV2_2 contract
  const fiatTokenV2_2 = await deployContract(
    'FiatTokenV2_2',
    'create',
    [],
    {},
    {}
  );

  // Initialize the deployed contract with dummy values
  await fiatTokenV2_2.initialize(
    '',
    '',
    '',
    0,
    THROWAWAY_ADDRESS,
    THROWAWAY_ADDRESS,
    THROWAWAY_ADDRESS,
    THROWAWAY_ADDRESS
  );
  await fiatTokenV2_2.initializeV2('');
  await fiatTokenV2_2.initializeV2_1(THROWAWAY_ADDRESS);
  await fiatTokenV2_2.initializeV2_2([], '');

  return fiatTokenV2_2.getAddress();
}

const deployFiatTokenProxy = async (fiatTokenImpl: string) => {
  const fiatTokenProxy = await deployContract(
    'FiatTokenProxy',
    'create',
    [fiatTokenImpl],
    {},
    {}
  );

  return fiatTokenProxy.getAddress();
}

const deployMasterMinter = async (proxyAddress: string) => {
  const masterMinter = await deployContract(
    'MasterMinter',
    'create',
    [proxyAddress],
    {},
    {}
  );

  // Transfer ownership of the master minter to the master minter owner
  await masterMinter.transferOwnership(OWNER);
}
