import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-foundry");

const config: HardhatUserConfig = {
  defaultNetwork: "abstractTestnet",
  networks: {
    abstractTestnet: {
      url: "https://api.testnet.abs.xyz",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL:
        "https://api-explorer-verify.testnet.abs.xyz/contract_verification",
    },
    zkSyncMainnet: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: `https://convincing-prettiest-frost.zksync-mainnet.quiknode.pro/a14018fec401cbe6626d8a200375555d21a5503e/`,
      zksync: true,
      verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
    },
    zeroTestnet: {
      url: 'https://zerion-testnet-proofs.rpc.caldera.xyz/http',
      zksync: true,
      ethNetwork: 'sepolia',
      verifyURL: 'https://zerion-testnet-proofs.explorer.caldera.xyz/contract_verification'
    },
    zeroMainnet: {
      url: 'https://zero-network.calderachain.xyz/http',
      ethNetwork: 'mainnet',
      zksync: true
    },
    dockerizedNode: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
    inMemoryNode: {
      url: "http://127.0.0.1:8011",
      ethNetwork: "localhost", // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
  zksolc: {
    version: "1.5.3",
    settings: {
      enableEraVMExtensions: true,
      libraries: {
        "contracts/usdc/util/SignatureChecker.sol": {
          "SignatureChecker": "0xbBB5d95A805b48E24f369127ECcDDF81e87f1A0F"
        }
      }
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          viaIR: true,
          evmVersion: "cancun",
          optimizer: {
            enabled: true,
          },
          metadata: {
            bytecodeHash: "none",
          },
        },
      },
      { version: "0.6.12" }
    ],
    overrides: {
      "contracts/relay/ERC20Router.sol": {
        version: "0.8.25",
        settings: {
          viaIR: true,
          evmVersion: "cancun"
        },
      },
      "contracts/seaport-1.5/Seaport.sol": {
        version: "0.8.17",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 4_294_967_295
          },
        },
      },
      "contracts/seaport-1.5/helpers/": {
        version: "0.8.17",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 4_294_967_295
          },
        },
      },
      "contracts/seaport-1.5/lib/": {
        version: "0.8.17",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 4_294_967_295
          },
        },
      },
      "contracts/seaport-1.5/conduit/Conduit.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/seaport-1.5/conduit/ConduitController.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/helper/TransferHelper.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/seaport-1.6/interfaces/IContractDeployer.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/uni-v2/UniswapV2ERC20.sol": {
        version: "0.5.16",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/uni-v2/UniswapV2Factory.sol": {
        version: "0.5.16",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/uni-v2/UniswapV2Pair.sol": {
        version: "0.5.16",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/uni-v2/libraries/UQ112x112.sol": {
        version: "0.5.16",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/uni-v2/libraries/Math.sol": {
        version: "0.5.16",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/uni-v2/libraries/SafeMath.sol": {
        version: "0.5.16",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/SignatureChecker.sol": {
        version: "0.6.12"
      },
      "contracts/ECRecover.sol": {
        version: "0.6.12"
      },
      "contracts/IERC1271.sol": {
        version: "0.6.12"
      },
      "contracts/usdc/*": {
        version: "0.6.12"
      },
    },
  },
};

export default config;
