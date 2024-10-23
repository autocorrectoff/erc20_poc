const { Wallet, providers, utils, Contract } = require('ethers');
require('dotenv').config();

(async() => {
    const url = 'https://polygon-mainnet.infura.io/v3/c9657d3c5621495c9f6b60c3913df958';
    const toAddr = '0x459F4a5D00801b560e08E4Cf73b05d3bC6f22c5d';
    const amountMatic = '1';
    const confirmations = 6;

    const erc20ABI = [
        'function symbol() public view returns (string)',
        'function name() public view returns (string)',
        'function decimals() public view returns (uint8)',
        'function totalSupply() public view returns (uint)',
        'function balanceOf(address usr) public view returns (uint)',
        'function transfer(address dst, uint wad) returns (bool)',
    ];
    const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    
    const wallet = new Wallet(process.env.PRIVATE_KEY, new providers.JsonRpcProvider(url));

    const feeData = await wallet.getFeeData();
    
    // const txReq = await wallet.populateTransaction({ to: toAddr, value: utils.parseEther(amountMatic), gasPrice: feeData.gasPrice });
    // const tx1 = await wallet.sendTransaction(txReq);
    // console.log(txReq);
    // await tx1.wait(confirmations);
    
    const amount = '0.01';
    const tokensToTransfer = utils.parseUnits(amount, 6);

    const erc20TokenContract = new Contract(usdc, erc20ABI, wallet);
    const txReq1 = await erc20TokenContract.populateTransaction.transfer(toAddr, tokensToTransfer, {gasPrice: feeData.gasPrice});
    const txReq1Signed = await wallet.signTransaction(txReq1);
    console.log(txReq1);
    console.log(txReq1Signed);
    // const tx2 = await erc20TokenContract.transfer(to, tokensToTransfer, { gasPrice: feeData.gasPrice, gasLimit: gasEstimate });
    // await tx2.wait(confirmations);
})();
