const initialize = () => {
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
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  const onboardButton = document.getElementById('connectButton');
  const getBalanceButton = document.getElementById('getBalance');
  const getChainButton = document.getElementById('getChain');
  let currentAddress='';

  function handleAccountsChanged(accounts) {
    currentAddress = accounts[0];
    onboardButton.innerText = currentAddress.substring(0,4).concat("...").concat( currentAddress.substring(currentAddress.length-4,currentAddress.length));
  }

  function handleChainChanged (chainId) {
    if (chainId != 0x89) {
      getChainButton.innerText='SWITCH TO MATIC';
      try {
        ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: "0x89" }],
        });
      } 
      catch (switchError) {
        if (switchError.code === 4902) {
          try {
            ethereum.request({
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
    
  const MetaMaskClientCheck = () => {
    if (! Boolean(window.ethereum && window.ethereum.isMetaMask)) {
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onClickInstall;
      onboardButton.disabled = false;
    } else {
      onboardButton.innerText = 'CONNECT';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
      ethereum.on('accountsChanged', handleAccountsChanged);    
      ethereum.on('chainChanged', handleChainChanged);
      if(ethereum.isConnected()) {
        ethereum.request({ method: 'eth_requestAccounts' }).then(handleAccountsChanged);
        ethereum.request({ method: 'eth_chainId'}).then(handleChainChanged);
        ethereum.request({
          method: 'eth_getBalance',
          params: ['0x8df3aad3a84da6b69a4da8aec3ea40d9091b2ac4' ,'latest'],
        }).then((quantity)=>{console.log(quantity)});
      }
    }
  };
  MetaMaskClientCheck();
}
window.addEventListener('DOMContentLoaded', initialize)
