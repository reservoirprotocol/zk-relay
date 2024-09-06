import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import hre from "hardhat";
import { Wallet } from "zksync-ethers";

const main = async () => {
  const wallet = new Wallet(process.env.DEPLOYER_PK!);
  const deployer = new Deployer(hre, wallet);

  const conduitControllerArtifact = await deployer.loadArtifact(
    "ConduitController"
  );
  const conduitController = await deployer.deploy(conduitControllerArtifact);
  console.log(
    `ConduitController deployed to address ${conduitController.address.toLowerCase()}`
  );

  const seaportArtifact = await deployer.loadArtifact("Seaport");
  const seaport = await deployer.deploy(seaportArtifact, [
    conduitController.address,
  ]);
  console.log(`Seaport deployed to address ${seaport.address.toLowerCase()}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });