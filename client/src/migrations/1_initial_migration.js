const NiceToken = artifacts.require("NiceToken")

module.exports = async function (deployer) {
  await deployer.deploy(NiceToken);

  const niceToken = await NiceToken.deployed()
  // Mint 200 NiceToken for the first account
  const result = await niceToken.mint(
    '0xf60FE208FC3d084B64b6b71790CC32b51dc09925',
    '200000000000000000000'
  )
   console.info("Success")
};