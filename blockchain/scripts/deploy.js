const hre = require("hardhat");

async function main() {
  const Hackathon = await hre.ethers.getContractFactory("Hackathon");
  const hackathon = await Hackathon.deploy();

  await hackathon.waitForDeployment();

  console.log(
    `Hackathon contract deployed to: ${await hackathon.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
