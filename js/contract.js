const chain_MATIC = {
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },                  
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'] 
};
const forwarderOrigin = 'http://localhost:9010'
let onboarding = new MetaMaskOnboarding({ forwarderOrigin });
let onboardButton = document.getElementById('connectButton');
let getBalanceButton = document.getElementById('getBalance');
let getChainButton = document.getElementById('getChain');
let web3 = new Web3("https://cloudflare-eth.com")
let currentAddress='';

$(document).ready(() => {

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  };
  const onClickConnect = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  };
    
  if (! Boolean(web3.eth)) {
    onboardButton.innerText = 'Click here to install MetaMask!';
    onboardButton.onclick = onClickInstall;
    onboardButton.disabled = false;
  } else {
    onboardButton.innerText = 'CONNECT';
    onboardButton.onclick = onClickConnect;
    onboardButton.disabled = false;
    web3.eth.on('accountsChanged', handleAccountsChanged);    
    web3.eth.on('chainChanged', handleChainChanged);
    if(web3.eth.isConnected()) {
      web3.eth.request({ method: 'eth_requestAccounts' }).then(handleAccountsChanged);
      web3.eth.request({ method: 'eth_chainId'}).then(handleChainChanged);
      web3.eth.request({
        method: 'eth_getBalance',
        params: ['0x8df3aad3a84da6b69a4da8aec3ea40d9091b2ac4' ,'latest'],
      }).then((quantity)=>{console.log(quantity)});
    }
  }
});

function handleChainChanged (chainId) {
  if (chainId != 0x89) {
    getChainButton.innerText='SWITCH TO MATIC';
    try {
      web3.eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x89" }],
      });
    } 
    catch (switchError) {
      if (switchError.code === 4902) {
        try {
          web3.eth.request({
            method: 'wallet_addEthereumChain',
            params: [chain_MATIC],
          });
        } catch (addError) {console.error(addError)}
      }
      else
        console.log(switchError)
    }
  } else
    getChainButton.innerText='MATIC';    
}

function handleAccountsChanged(accounts) {
  currentAddress = accounts[0];
  onboardButton.innerText = currentAddress.substring(0,4).concat("...").concat( currentAddress.substring(currentAddress.length-4,currentAddress.length));
}