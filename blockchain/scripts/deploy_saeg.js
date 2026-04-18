const hre = require("hardhat");

async function main() {
  // Get the first account from the network (Ganache)
  const [deployer] = await hre.ethers.getSigners();
  const fdtAccount = deployer.address;
  
  console.log("Deploying SAEG_Core with the account:", fdtAccount);

  const SAEG_Core = await hre.ethers.getContractFactory("SAEG_Core");
  const saegCore = await SAEG_Core.deploy(fdtAccount);

  await saegCore.waitForDeployment();

  console.log(
    `SAEG_Core contract deployed to: ${await saegCore.getAddress()}`
  );
  console.log(`FDT Account set to: ${fdtAccount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
