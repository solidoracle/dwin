const { ethers } = require('hardhat');

async function main() {
  const Dwin = await ethers.getContractFactory('Dwin');
  const dwin = await Dwin.deploy();
  await dwin.deployed();

  console.log('CryptoDevsDAO deployed to: ', dwin.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
