import { ethers } from 'ethers';
import { useState } from 'react';
import Token from './artifacts/contracts/Token.sol/Token.json';
import './App.css';

const tokenContractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [state, setState] = useState({
    sendAmount: '',
    sendAccount: ''
  });

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  async function requestAccount() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account;
  }

  const handleGetMyBalance = async () => {
    if (!window.ethereum) return;

    const account = await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenContractAddr, Token.abi, provider);

    console.log('account ==>', account);

    try {
      const balance = await contract.getBalance(account);
      console.log('balance ==>', balance.toString());
    } catch (err) {
      console.error('Error getting balance ==>', err);
    }

  }
  
  const handleSendCoins = async () => {
    console.log('called handleSendCoins');

    if (!window.ethereum) return;
    if (!state.sendAmount || !state.sendAccount) return;

    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenContractAddr, Token.abi, signer);

    try {
      const transaction = await contract.transfer(state.sendAccount, Number(state.sendAmount));
      await transaction.wait();
  
      console.log(`${state.sendAmount} coins sent to ${state.sendAccount}`);

      setState({
        sendAmount: '',
        sendAccount: ''
      })
    } catch (err) {
      console.error('Error transfering funds ==>', err);
    }
  }

  return (
    <div className="App">

      <div>
        <input 
          type="button" 
          value="Get My Balance" 
          onClick={handleGetMyBalance}
        />
        {/* {' '}
        &nbsp;
        {' '}
        <input 
          name="accountId"
          type="text" 
          placeholder="Account Id" 
          value={state.accountId}
          onChange={handleInputChange}
        /> */}
      </div>
      <br />
      <div>
        <input 
          type="button" 
          value="Send Coins" 
          onClick={handleSendCoins}
        />
        {' '}
        &nbsp;
        {' '}
        <input 
          name="sendAmount"
          type="text" 
          placeholder="Amount" 
          value={state.sendAmount}
          onChange={handleInputChange}
        />
        {' '}
        &nbsp;
        {' '}
        <input 
          name="sendAccount"
          type="text" 
          placeholder="Recipient Account" 
          value={state.sendAccount}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default App;
