import { ethers } from "hardhat";
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(
  provider: { getBalance: (address: string) => Promise<any> },
  address: string
) {
  const balanceBigInt = await provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to goerli.
  const contractAddress = "0x18F8CFd3936636d09E0BC8f01291C60bD7B7f128";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API_KEY
  );

  // Ensure the signer is the same address as the original contract deployer or
  // else the script will fail with an error

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

  // Instantiate the contract
  const buyMeACoffee = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  // Check starting balances.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log(
    "current balance of contract: ",
    await getBalance(provider, buyMeACoffee.address),
    "ETH"
  );

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..");
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
}

// This pattern is recommended to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
