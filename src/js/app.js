
var Web3 = require('web3');
let web31;
 
App = {
    web3Provider: null,
    contracts: {},
    user:{},
    users: [],
    tokenPrice: 0,  
    tokenSold: 0,    
    tokensAvailable: 50000,
    

    /* *****************************  WEB 3 & CONTRACT   *********************************** */

    initWeb3 : async function (){
        if(window.ethereum){
            console.log("inside etheerium");
            web31 = new Web3(window.ethereum)
            window.ethereum.enable()
        } else if(window.web3) {
            console.log("inside web3");
            web31 = new Wb3(window.web3.currentProvider);
        } else {
            console.log("inside console.log");
        }
        web3.eth.getAccounts(function (error,accounts){
            console.log("acc: "+ accounts);   
            App.user =    accounts[0]; 
            console.log("user acc : "+  App.user);   
        })
        console.log("start");
        App.web3Provider = web31.currentProvider;
        console.log("inside ");
        web3 = new Web3(App.web3Provider);
        web3 = web31;
        return  await App.initContracts();
    },

    initContracts: function() {
        $.getJSON("NFT.json", function(NFT) {
          App.contracts.NFT = TruffleContract(NFT);
          App.contracts.NFT.setProvider(App.web3Provider);
          App.contracts.NFT.deployed().then(function(NFT) {
            console.log("NFT Address:", NFT.address);
          });
        }).done(function() {
          $.getJSON("SlenNftRft.json", function(SlenNftRft) {
            App.contracts.SlenNftRft = TruffleContract(SlenNftRft);
            App.contracts.SlenNftRft.setProvider(App.web3Provider);
            App.contracts.SlenNftRft.deployed().then(function(SlenNftRft) {
              console.log("SlenNftRft Address:", SlenNftRft.address);
            });
          }).done(function() {
          $.getJSON("DAI.json", function(DAI) {
            App.contracts.DAI = TruffleContract(DAI);
            App.contracts.DAI.setProvider(App.web3Provider);
            App.contracts.DAI.deployed().then(function(DAI) {
              console.log("DAI Address:", DAI.address);
            });    
            return App.render();
          });
        })
      })
      },    

    /* *****************************  GENERAL FUNCTIONS   *********************************** */
   
  render: function() {
    const admin = "0xE93c290e8FcB78D21C14cd8E59751E1119827026";
    const buyer1 = "0xD9098e8230643Ea72F1C65c3Ce142252033B46d5";
    const buyer2 = "0x6A2C42c0c2138b15576509BbB04318323320122b";

    $(".user-addr").html("User Address : "+ App.user)

    App.contracts.SlenNftRft.deployed().then(async function(instance) {  
     // $(".totalsupply").html("SlenNftRft totalsupply : "+ JSON.stringify(await instance.totalsupply()));
      $(".icoSharePrice").html("SlenNftRft icoSharePrice : "+ await instance.icoSharePrice());
      $(".icoShareSupply").html("SlenNftRft icoShareSupply : "+ await instance.icoShareSupply());
      $(".icoEnd").html("SlenNftRft icoEnd : "+ await instance.icoEnd());
      $(".nftId").html("SlenNftRft nftId : "+ await instance.nftId());
      return instance;
    }).then(async function(instance1) {
      App.contracts.DAI.deployed().then(async function(daiInstance) { 
        $(".admin-address").html(admin);
        $(".dai-admin").html("<B>Dai Balance :</B> " + await daiInstance.balanceOf(admin)+" DAI");
        $(".dai-buyer1").html("<B>Dai Balance : </B>" + await daiInstance.balanceOf(buyer1)+" DAI");
        $(".dai-buyer2").html("<B>Dai Balance : </B>" + await daiInstance.balanceOf(buyer2)+" DAI");
        return daiInstance;
    }).then(async function(daiInstance) {
      App.contracts.NFT.deployed().then(async function(nftInstance) { 
        $(".buyer1-address").html(buyer1);
        $(".nft-admin").html("<B>NFT Balance : </B>" + await nftInstance.balanceOf(admin) +" NFT");
        $(".nft-buyer1").html("<B>NFT Balance : </B>" + await nftInstance.balanceOf(buyer1)+" NFT");
        $(".nft-buyer2").html("<B>NFT Balance : </B>" + await nftInstance.balanceOf(buyer2)+" NFT");
        return nftInstance;
    }).then(async function(daiInstance) {
      App.contracts.SlenNftRft.deployed().then(async function(slennftrftInstance) { 
        $(".buyer2-address").html(buyer2);
        $(".slennftrft-admin").html("<B>SlenNftRft Balance : </B>" + await slennftrftInstance.balanceOf(admin)+" RFT");
        $(".slennftrft-buyer1").html("<B>SlenNftRft Balance : </B>" + await slennftrftInstance.balanceOf(buyer1)+" RFT");
        $(".slennftrft-buyer2").html("<B>SlenNftRft Balance :</B> " + await slennftrftInstance.balanceOf(buyer2)+" RFT");
        return slennftrftInstance;
    });
    });
    });
    });
  },

  startIco: function() {
    var nft;    
    console.log("user: " + App.user);
    App.contracts.NFT.deployed().then(async function(nftInstance) { 
      nft = await nftInstance;
      return nftInstance;
    }).then(function(error,nftInstance) {
      App.contracts.SlenNftRft.deployed().then(async function(instance) {   
        console.log("nft: " + nft);             
        await nft.mint(App.user, 1); 
        await nft.approve(instance.address, 1);
        return instance.startIco();
      }).then(function(error,result) {
      if(!error) {
        console.log("error :" + error);
      } 
      if(result) {
        console.log("result :" + result);
      }
      console.log("ICO  started...");
    });
  });
  },

  buyShares: function() {
    var dai;  
    var share_amount = $('#share_amount').val();
    var dai_amount = $('#dai_amount').val();
    console.log("share_amount: " + share_amount);
    console.log("dai_amount: " + dai_amount);
   
    App.contracts.DAI.deployed().then(async function(instance) { 
      dai = instance; 
      return instance;
    }).then(function(error,result) {
    App.contracts.SlenNftRft.deployed().then(async function(instance) { 
      await dai.mint( App.user, dai_amount); 
      await dai.approve(instance.address, share_amount); 
      return instance.buyShare(share_amount, {from:App.user});
    }).then(function(result) {
      console.log("Bought shares.....")
      // $(".transfer-op").text("Bought " + share_amount + " nft tokens successfully " + 
      // transfer_address + " successfully.");
    });
  });
},

  init : async function (){
      await App.initWeb3();       
  }
},

  /* ************************ SCRIPT FUNCTIONS *************************** */

$(function() {
    $(window).load(function() {
      App.init();  
    });
  });
