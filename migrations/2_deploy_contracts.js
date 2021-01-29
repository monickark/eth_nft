var DAI = artifacts.require("./DAI.sol");
var NFT = artifacts.require("./NFT.sol");
var SlenNftRft = artifacts.require("./SlenNftRft.sol");

module.exports = function(deployer) {    
   deployer.deploy(NFT, 'Slenex NFT', 'NFT').then(async function() { 
      await deployer.deploy(DAI).then(async function() {
         const _icoShareSupply = 10;
         console.log("NFT Address : " + NFT.address);
         console.log("_icoShareSupply : " + _icoShareSupply);
         return deployer.deploy(SlenNftRft, 'Slenex Rft', 'SRFT', NFT.address, 1, 1, 
         _icoShareSupply, DAI.address);
      });
});
}