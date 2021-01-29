const { time } = require('@openzeppelin/test-helpers');
const SlenNftRft = artifacts.require('SlenNftRft.sol');
const NFT = artifacts.require('NFT.sol');
const DAI = artifacts.require('DAI.sol');

const DAI_AMOUNT = web3.utils.toWei('10');
const SHARE_AMOUNT1 = web3.utils.toWei('2');
const SHARE_AMOUNT2 = web3.utils.toWei('3');
const SHARE_AMOUNT3 = web3.utils.toWei('4');
const SHARE_AMOUNT4 = web3.utils.toWei('5');

/** Call SlenNftRft contract and get addresses of deployed network */
// 1. Create dai and nft instance
// 2. Admin will create refungible token smart contract
// 3. B4 creating the smart contract the admin have to buy a NFT from exchange with either ether/dai for exchange
// 4. Then admin deploy the created refungible token and send the token he just bought to Sm
// 5. Then admin will start ico for other investers to buy some shares in SlenNftRft
// 	- these invenstors will send DAI to SlenNftRft token
// 	- for return he will get some shares from the NFT that is inside SlenNftRft contract
// 6. The admin will get all the dai sent to the contract thats to compensate him for having NFT purchased before 
// 7. And if there is any remaining unbought shares are also sent to admin 
// 8. Anybody with the share of SlenNftRft can go to exchange and do some trading 
// 9. You can be sure of the value of thr SlenNftRft because this SlenNftRft is backed by the NFT token which is inside the FRT contract 

contract('SlenNftRft', async addresses => {
    const [admin, buyer1, buyer2, buyer3, buyer4, _] = addresses;
    it('ico should work', async() => {

        /** Create dai, nft and SlenNftRft instance */
        const dai = await DAI.new();
        const nft = await NFT.new('Slenex NFT', 'NFT');
        const slenNftRft = await SlenNftRft.new('Slenex SlenNftRft', 'SlenNftRft', nft.address, 1, 1, 
                                   web3.utils.toWei('100000'), dai.address);

        /** Create 1st nft token for admin to start ico*/
        await nft.mint(admin, 1);
        await nft.approve(slenNftRft.address, 1);
        await slenNftRft.startIco();

        await Promise.all([ dai.mint(buyer1, DAI_AMOUNT), dai.mint(buyer2, DAI_AMOUNT),
            dai.mint(buyer3, DAI_AMOUNT), dai.mint(buyer4, DAI_AMOUNT)]);  
            
        await dai.approve(slenNftRft.address, DAI_AMOUNT, {from:buyer1});
        await slenNftRft.buyShare(SHARE_AMOUNT1, {from:buyer1});
        await dai.approve(slenNftRft.address, DAI_AMOUNT, {from:buyer2});
        await slenNftRft.buyShare(SHARE_AMOUNT2, {from:buyer2});
        await dai.approve(slenNftRft.address, DAI_AMOUNT, {from:buyer3});
        await slenNftRft.buyShare(SHARE_AMOUNT3, {from:buyer3});
        await dai.approve(slenNftRft.address, DAI_AMOUNT, {from:buyer4});
        await slenNftRft.buyShare(SHARE_AMOUNT4, {from:buyer4});

        await time.increase(7*86400 + 1);
        await slenNftRft.withdrawIcoProfits();

        console.log("****************** AFTER SHARE PURCHASE ***********************");

        const balanceShareAfterBuyer1 = await slenNftRft.balanceOf(buyer1);
        const balanceShareAfterBuyer2 = await slenNftRft.balanceOf(buyer2);
        const balanceShareAfterBuyer3 = await slenNftRft.balanceOf(buyer3);
        const balanceShareAfterBuyer4 = await slenNftRft.balanceOf(buyer4);

        console.log("Buyer1 bal : " + balanceShareAfterBuyer1.toString());
        console.log("Buyer2 bal : " + balanceShareAfterBuyer2.toString());
        console.log("Buyer3 bal : " + balanceShareAfterBuyer3.toString());
        console.log("Buyer4 bal : " + balanceShareAfterBuyer4.toString());

        assert(balanceShareAfterBuyer1.toString() === SHARE_AMOUNT1);
        assert(balanceShareAfterBuyer2.toString() === SHARE_AMOUNT2);
        assert(balanceShareAfterBuyer3.toString() === SHARE_AMOUNT3);
        assert(balanceShareAfterBuyer4.toString() === SHARE_AMOUNT4);

        const balanceAdminAfterDai = await dai.balanceOf(admin);
        console.log("Admin bal : " + balanceAdminAfterDai.toString());
        //assert(balanceAdminAfterDai.toString() === web3.utils.toWei('100000'));
    })
})