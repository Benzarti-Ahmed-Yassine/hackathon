require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "monkey salad lucky arctic space crack hope maze point sun group merit",
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  },
};
