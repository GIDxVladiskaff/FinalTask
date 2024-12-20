import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VotingContract } from "../typechain-types";

/**
 * @param hre
 */
const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  const { deploy } = hre.deployments;

  try {
    const deploymentResult = await deploy("VotingContract", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });

    console.log(`✅ VotingContract deployed successfully at address: ${deploymentResult.address}`);

    const votingContract = await hre.ethers.getContract<VotingContract>("VotingContract", deployer);

    const initialGreeting = await votingContract.greeting();
    console.log(`👋 Initial greeting: "${initialGreeting}"`);
  } catch (error) {
    console.error("❌ Error deploying VotingContract:", error);
    throw error;
  }
};

export default deployVotingContract;

deployVotingContract.tags = ["VotingContract"];
