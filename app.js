const { Wallet, providers, Contract, utils } = require('ethers');
require('dotenv').config();

(async () => {
    const nodeUrl = 'https://polygon-mainnet.infura.io/v3/c9657d3c5621495c9f6b60c3913df958';
    const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

    const wallet = new Wallet(process.env.PRIVATE_KEY, new providers.JsonRpcProvider(nodeUrl));

    const erc20ABI = [
        'function symbol() public view returns (string)',
        'function name() public view returns (string)',
        'function decimals() public view returns (uint8)',
        'function totalSupply() public view returns (uint)',
        'function balanceOf(address usr) public view returns (uint)',
        'function transfer(address dst, uint wad) returns (bool)',
    ];

    const to = '0x459F4a5D00801b560e08E4Cf73b05d3bC6f22c5d';

    const erc20TokenContract = new Contract(usdc, erc20ABI, wallet);

    // get usdc balance
    let balance = await erc20TokenContract.balanceOf(wallet.address);
    let decimals = await erc20TokenContract.decimals();
    balance = Number(balance.toString()) / 10 ** decimals;
    console.log(balance);

    const amount = '0.5';
    const tokensToTransfer = utils.parseUnits(amount, decimals);

    // estimate gas price
    const feeData = await wallet.getFeeData();
    const gasEstimate = await erc20TokenContract.estimateGas.transfer(to, tokensToTransfer);
    const txFee = feeData.gasPrice.mul(gasEstimate);
    console.log(gasEstimate.toString());

    // transfer 0.5 usdc
    const tx = await erc20TokenContract.transfer(to, tokensToTransfer, { gasPrice: feeData.gasPrice, gasLimit: gasEstimate });
    console.log(tx);
    await tx.wait(1);

    // get usdc balance
    balance = await erc20TokenContract.balanceOf(wallet.address);
    decimals = await erc20TokenContract.decimals();
    balance = Number(balance.toString()) / 10 ** decimals;
    console.log(balance);
})();