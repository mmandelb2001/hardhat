const hre = require("hardhat");
const axios = require('axios');                

const walletAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B ";
const tokenOne = "0xcf92422e6e75bea69bfc45cb7bad363f5a16e977ceb03c0755f7f00ef5e8862a";
const tokenTwo = "0x13748d548D95D78a3c83fe3F32604B4796CFfa23";
const tokenThree = "0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44";
const tokenFour = "0xCB898b0eFb084Df14dd8E018dA37B4d0f06aB26D ";
const usdcToken = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

async function main() {
  //create contracts to find balance of each token
  const bal = await hre.ethers.getContractFactory("Balance");
  const balance = await bal.deploy(walletAddress);

  await balance.deployed();  
  //save the token amounts grabbed by the balance contract
  const tokenOneAmt = await balance.queryERC20Balance(tokenOne);
  const tokenTwoAmt = await balance.queryERC20Balance(tokenTwo);
  const tokenThreeAmt = await balance.queryERC20Balance(tokenThree);
  const tokenFourAmt = await balance.queryERC20Balance(tokenFour);
  //use token amount to swap
  const tokenOneBalInUSDC = await swapper(tokenOne, usdcToken, web3.utils.toWei(tokenOneAmt, 'ether'))
  const tokenTwoBalInUSDC = await swapper(tokenOne, usdcToken, web3.utils.toWei(tokenTwoAmt, 'ether'))
  const tokenThreeBalInUSDC = await swapper(tokenOne, usdcToken, web3.utils.toWei(tokenThreeAmt, 'ether'))
  const tokenFourBalInUSDC = await swapper(tokenOne, usdcToken, web3.utils.toWei(tokenFourAmt, 'ether'))
}
//transaction needs to be approved before swap is made
async function approve(tokenAddress, tokenAmount){
  try{
      //1inch url for approval
      const response = await axios.get(`https://api.1inch.exchange/v3.0/137/approve/calldata?tokenAddress=${tokenAddress}&amount=${tokenAmount}`)
      if(response.data){
          data = response.data
          data.gas = 1000000
          data.from = wallet.address
          tx = await web3.eth.sendTransaction(data)
          if(tx.status){
              console.log("successful approval")
          }else{
              console.log("unsuccesful approval")
              console.log(tx)
          }
      }
  }catch(err){
      console.log("could not approve token")
      console.log(err)
  }
}
//swaps the two tokens and returns the token amount in the new tokwn
async function swapper(fromTokenAddress, toTokenAddress, fromTokenAmount){
  try{
      await approve(fromTokenAddress, fromTokenAmount)
      const response = await axios.get(`https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromTokenAmount}&fromAddress=${wallet.address}&slippage=0.1&disableEstimate=true`)
      if(response.data){
          console.log("swappig")
          //console.log(response.data)
          data = response.data
          data.tx.gas = 1000000
          tx = await web3.eth.sendTransaction(data.tx)
          if(tx.status){
              console.log("successful swap")
          }
          return response.data.toTokenAmount
      }
  }catch(err){
      console.log("swapper encountered an error below")
      console.log(err)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
