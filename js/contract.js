/* 
se una funzione viene richiamata con await si attende il termine dell'esecuzione e il si può usare il classico try catch
per usare await la funzione deve essere definita come async
se una funzione viene richiamata senza await ed è asicrona è necessario specificare il then e il catch
*/
const chain_MATIC = {
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },                  
  rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
  blockExplorerUrls: ['https://explorer.matic.network/'] 
};
let minABI = [
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  }
];
let token_check = {
  "CWIZt": "0xa61F0AD5A30b3165Da1AcF283FBC81Ab77c3391B",
  "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
}
const forwarderOrigin = 'http://localhost:8080'
let onboarding = new MetaMaskOnboarding({ forwarderOrigin });
let onboardButton = document.getElementById('connectButton');
let getBalanceButton = document.getElementById('getBalance');
let getChainButton = document.getElementById('getChain');
let web3 = null;
let currentAddress = '';
let balance_token_nativo = null;

$(document).ready(() => {

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  };
  const onClickConnect = async () => {
    try {
      await web3.eth.requestAccounts().then(checkConnect);
    } catch (error) {
      console.log(error);
    }
  };
    
  if (! Boolean(window.ethereum)) {
    onboardButton.innerText = 'Click here to install MetaMask!';
    onboardButton.onclick = onClickInstall;
  } else {
    //web3 = new Web3("https://cloudflare-eth.com");
    web3 = new Web3(window.ethereum);
    onboardButton.innerText = 'CONNECT';
    onboardButton.onclick = onClickConnect;
    web3.eth.getAccounts().then(checkConnect)
    //window.ethereum.on('accountsChanged', handleAccountsChanged);    
    //window.ethereum.on('chainChanged', handleChainChanged);
    }
});

async function getBalanceNative() {
  balance_token_nativo = null;
  let wait_resp = true;
  while (wait_resp) {
    try {
      balance = await web3.eth.getBalance(currentAddress);
      balance_token_nativo = balance / Math.pow(10, chain_MATIC['nativeCurrency']['decimals']);
      wait_resp = false;
    } catch (error) {
      console.log(error);
      if (JSON.parse("{" + String(error).split("{")[1].split("}")[0] + "}")['code'] != -32005)
        wait_resp = false;
    }
  }
  return balance_token_nativo;
}

async function getBalance(token_name, token_address) {
  let contract = new web3.eth.Contract(minABI,token_address);
  let to_ret = null;
  let wait_resp = true;
  while (wait_resp) {
    try {
      balance = await contract.methods.balanceOf(currentAddress).call();
      to_ret = balance / Math.pow(10, chain_MATIC['nativeCurrency']['decimals']);
      wait_resp = false;
    } catch (error){
      console.log(error);
      if (JSON.parse("{" + String(error).split("{")[1].split("}")[0] + "}")['code'] != -32005)
        wait_resp = false;
    }
  }
  return to_ret
}

async function checkConnect(accounts){
  if (accounts.length > 0){
    handleAccountsChanged(accounts);
    chain_id = await web3.eth.getChainId();
    handleChainChanged(chain_id);
    /*
    try {
      web3.currentProvider.request({
        method: 'eth_getBalance',
        params: [currentAddress ,'latest'],
      }).then(readBalance);
    } catch (error) {console.log(error); console.log(error.code)}*/
    getBalanceNative().then(console.log);
    for (let [key, value] of Object.entries(token_check)) {
      getBalance(key, value).then(console.log)
    }
  }
}

function handleChainChanged (chainId) {
  button_text = chain_MATIC['nativeCurrency']['name']
  if (chainId != chain_MATIC['chainId']) {
    button_text = 'SWITCH TO ' + chain_MATIC['nativeCurrency']['name'];
    web3.currentProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain_MATIC['chainId'] }],
    }).catch((err) => {
      if (err.code === 4902) {
          web3.currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [chain_MATIC],
          }).catch((addError) => {console.log(addError)});
      }
    });
  }
  getChainButton.innerText = button_text;   
}

function handleAccountsChanged(accounts) {
    currentAddress = accounts[0];
    onboardButton.innerText = currentAddress.substring(0,4).concat("...").concat( currentAddress.substring(currentAddress.length-4,currentAddress.length));
}