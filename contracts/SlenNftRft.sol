// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

//RFT allows you to buy fraction of NFT mapped
contract SlenNftRft is ERC20 {
    uint public icoSharePrice;
    uint public icoShareSupply;
    uint public icoEnd;

    uint public nftId;
    IERC721 public nft;
    IERC20 public dai;

    address public admin;

    constructor(string memory _name, string memory _symbol, 
                address _nftAddress, uint _nftId, uint _icoSharePrice, 
                uint _icoShareSupply, address _daiAddress)
        ERC20(_name, _symbol) {
            nftId = _nftId;
            nft = IERC721(_nftAddress);
            icoSharePrice = _icoSharePrice;
            icoShareSupply = _icoShareSupply;
            dai = IERC20(_daiAddress);
            admin = msg.sender;
    }        
    
    function startIco() external returns (string memory) {
        require(msg.sender == admin, 'Only admin....');
        nft.transferFrom(msg.sender, address(this), nftId);
        icoEnd = block.timestamp + 7 * 86400; //7 days
        return "icostarted";
    }
    // ico not yet started
    // ico is finished
    // not enough shares left
    // calculate daiamt
    // transfer from sender to address
    function buyShare(uint shareAmount) external returns (string memory){
        require(icoEnd > 0, 'ico not yet started');
        require(block.timestamp < icoEnd, 'ico is finished');
        require(totalSupply() + shareAmount <= icoShareSupply, 'not enough shares left');
        uint daiAmt = shareAmount * icoSharePrice;
        dai.transferFrom(msg.sender, address(this), daiAmt);
        _mint(msg.sender, shareAmount);
        return "bought shares...";
    }

    function withdrawIcoProfits() external {
        require(msg.sender == admin, 'Only admin');
        require(block.timestamp > icoEnd, 'ico not finished yet');
        uint daiBalance = dai.balanceOf(address(this));
        if(daiBalance > 0)     {
            dai.transfer(admin, daiBalance);
        }
        uint unsoldShareBalance = icoShareSupply - totalSupply();
        if(unsoldShareBalance > 0) {
            _mint(admin, unsoldShareBalance);
        }
    }
}