import * as fs from 'fs'
import { deployContract } from './utils'

export default async function () {
  const unsupportedContract = await deployUnsupported();
  const unsupportedAddress = await unsupportedContract.getAddress();
  await deployUniversalRouter(unsupportedAddress, 'deploy/routerParams/zero_mainnet.json');
}

const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";

const deployUnsupported = async () => {
  const unsupportedContract = await deployContract(
    "UnsupportedProtocol",
    "create2",
    [], // constructorArguments (empty array if there are no constructor arguments)
    {}, // options (empty object if no options are needed)
    {
      customData: {
        salt: salt
      }
    }
  );

  return unsupportedContract;
}

const deployUniversalRouter = async (unsupported: string, pathToParams: string) => {
  console.log(`Running deploy script for the UniversalRouter contract`)

  let params: any = fetchParameters(pathToParams)
  params = {
    permit2: mapUnsupported(params.permit2, unsupported),
    weth9: mapUnsupported(params.weth9, unsupported),
    seaport: mapUnsupported(params.seaport, unsupported),
    nftxZap: mapUnsupported(params.nftxZap, unsupported),
    x2y2: mapUnsupported(params.x2y2, unsupported),
    foundation: mapUnsupported(params.foundation, unsupported),
    sudoswap: mapUnsupported(params.sudoswap, unsupported),
    nft20Zap: mapUnsupported(params.nft20Zap, unsupported),
    cryptopunks: mapUnsupported(params.cryptopunks, unsupported),
    looksRare: mapUnsupported(params.looksRare, unsupported),
    routerRewardsDistributor: mapUnsupported(params.routerRewardsDistributor, unsupported),
    looksRareRewardsDistributor: mapUnsupported(params.looksRareRewardsDistributor, unsupported),
    looksRareToken: mapUnsupported(params.looksRareToken, unsupported),
    v2Factory: mapUnsupported(params.v2Factory, unsupported),
    v3Factory: mapUnsupported(params.v3Factory, unsupported),
    pairInitCodeHash: params.pairInitCodeHash,
    poolInitCodeHash: params.poolInitCodeHash,
  }

  console.log('routerParams: ')
  console.log(params)
  await deployContract(
    'UniversalRouter',
    'create2',
    [params],
    {},
    {
      customData: {
        salt: salt
      }
    }
  )
}

function fetchParameters(pathToJSON: string): any {
  return JSON.parse(fs.readFileSync(pathToJSON, 'utf8'))
}

function mapUnsupported(address: string, unsupported: string): string {
  return address === '0x0000000000000000000000000000000000000000' ? unsupported : address
}
