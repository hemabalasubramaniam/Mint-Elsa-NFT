import { ethers } from "./ethers-6.7.esm.min.js"
import { implementationABI, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectWallet");
connectButton.onclick = connect
const mintButton = document.getElementById("mintNFT")
mintButton.onclick = mintNFT;
let walletAddress;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      walletAddress = accounts[0];
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Install MetaMask"
  }
  document.getElementById('status').innerText = "";
}


async function mintNFT() {
  document.getElementById('status').innerText = "";
  if (!walletAddress) {
    document.getElementById('status').innerText = "Please connect your wallet first!";
  }
  else{
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await ethereum.request({ method: "eth_accounts" })
      const recipient = address[0];
      const proxycontract = new ethers.Contract(contractAddress, implementationABI, signer);
      const vectorId = 5541;

      document.getElementById('status').innerText = 'Transaction initiated... Waiting for confirmation.'
  
      const txResponse = await proxycontract.vectorMint721(vectorId, 1, recipient, { value: ethers.parseEther("0.0008"), gasLimit: 300000 })
      const txReceipt = await txResponse.wait();
  
      if (txReceipt.status === 1) {
        document.getElementById('status').innerText = 'NFT Minted Successfully!';
        window.location.href="MintSuccess.html"
      } else {
        document.getElementById('status').innerText = "Minting Failed";
      }
  
    } catch (error) {
      document.getElementById('status').innerText = "Error in Minting NFT!! Try Again."
    }
  }

}