/* 
se una funzione viene richiamata con await si attende il termine dell'esecuzione e il si può usare il classico try catch
per usare await la funzione deve essere definita come async
se una funzione viene richiamata senza await ed è asicrona è necessario specificare il then e il catch
*/
const forwarderOrigin = 'http://localhost:8080'
let onboarding = new MetaMaskOnboarding({ forwarderOrigin });
let onboardButton = $('#connectButton')[0];
let getBalanceButton = $('#getBalance')[0];
let getChainButton = $('#getChain')[0];
let web3 = null;
let currentAddress = '';
let balance_token_nativo = null;

function init_contract(){
  if (! Boolean(window.ethereum)) {
    onboardButton.innerText = 'Click here to install MetaMask!';
    onboardButton.onclick = () => {onboardButton.innerText = 'Onboarding in progress'; onboardButton.disabled = true; onboarding.startOnboarding();};
  } else {
    web3 = new Web3(window.ethereum);
    onboardButton.innerText = 'CONNECT';
    onboardButton.onclick = () => {web3.eth.requestAccounts().then(checkConnect).catch((err) => {console.log(err);});};
    web3.eth.getAccounts().then(checkConnect);
    web3.currentProvider.on('accountsChanged', handleAccountsChanged);    
    web3.currentProvider.on('chainChanged', handleChainChanged);
  }
  return;
}

async function getBalanceNative() {
  balance_token_nativo = null;
  let wait_resp = true;
  while (wait_resp) {
    try {
      balance = await web3.eth.getBalance(currentAddress);
      balance_token_nativo = balance / Math.pow(10, config["chain"]['native_currency']['decimals']);
      wait_resp = false;
    } catch (error) {
      error_code = JSON.parse("{" + String(error).split("{")[1].split("}")[0] + "}")['code']
      if (error_code != -32005 && error_code != -32000)
        wait_resp = false;
    }
  }
  return balance_token_nativo;
}

async function getBalance(token_name, token_address) {
  let contract = new web3.eth.Contract(config["methods"], token_address);
  let to_ret = null;
  let wait_resp = true;
  while (wait_resp) {
    try {
      balance = await contract.methods.balanceOf(currentAddress).call();
      to_ret = balance / Math.pow(10, config["chain"]['native_currency']['decimals']);
      wait_resp = false;
    } catch (error){
      error_code = JSON.parse("{" + String(error).split("{")[1].split("}")[0] + "}")['code']
      if (error_code != -32005 && error_code != -32000)
        wait_resp = false;
    }
  }
  return to_ret;
}

async function checkConnect(accounts){
  if (accounts.length > 0){
    handleAccountsChanged(accounts);
    chain_id = await web3.eth.getChainId();
    handleChainChanged(chain_id);
    getBalanceNative().then(console.log);
    for (let [key, value] of Object.entries(config["tokens"])) {
      getBalance(key, value).then(console.log)
    }
  }
  return;
}

function handleChainChanged (chainId) {
  button_text = config["chain"]['native_currency']['name']
  if (chainId != config["chain"]['id']) {
    button_text = 'SWITCH TO ' + config["chain"]['native_currency']['name'];
    web3.currentProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: config["chain"]['id'] }],
    }).catch((err) => {
      if (err.code === 4902) {
          web3.currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [config["chain"]],
          }).catch((addError) => {console.log(addError)});
      }
    });
  }
  getChainButton.innerText = button_text;
  return;
}

function handleAccountsChanged(accounts) {
    currentAddress = accounts[0];
    onboardButton.innerText = currentAddress.substring(0, 4).concat("...").concat(currentAddress.substring(currentAddress.length-4, currentAddress.length));
    return;
}