
import Web3 from "web3";
import lightwallet from "eth-lightwallet"
import { useEffect, useState } from "react";
import NiceToken from "../../NiceToken.json";

const contractAddress = "0xbE2D5296310C8777B840FEf5Fe5F962c15E081ea"
function Wallet() {
	const [newAccountBalance, setNewAccountBalance] = useState(null)
	const [newAccountAddress, setNewAccountAddress] = useState(null)
	const [phrase, setPhrase] = useState("")
	const [privateKey, setPrivateKey] = useState(null)
	const [keyStore, setKeyStore] = useState(null)
	const [balance, setbalance] = useState(0);
	const [account, setAccount] = useState("");
	const [niceContract, setContract] = useState(null);
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [accounts, setAccounts] = useState([]);

  useEffect(() => {
	const loadWeb3 = async () => {
		// Connect to Local blockchain network
		window.web3 = new Web3(
			new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545")
		);
		// To Connect to MetaMask
		// window.web3 = new Web3(window.ethereum);
	};

	const loadBlockchainData = async () => {
	  const web3 = window.web3;
	  const accounts = await web3.eth.getAccounts();
	  const niceContractAddress = "0xbE2D5296310C8777B840FEf5Fe5F962c15E081ea"; // Contract Address Here
	  const niceTokenContract = new web3.eth.Contract(
		NiceToken.abi,
		niceContractAddress
	  );
	  setContract(niceTokenContract);
	//   console.log(accounts);
	//   setAccounts(accounts);
	//   setAccountDetails(niceTokenContract, accounts[0]);
	};
	console.log("lightwallet", lightwallet)
	loadWeb3();
	loadBlockchainData();
  }, []);

  const setAccountDetails = async (niceContract, accountValue) => {
	const web3 = window.web3;
	setAccount(accountValue);
	const balance = await niceContract.methods.balanceOf(accountValue).call();
	setbalance(web3.utils.fromWei(balance.toString()));
  };

//   const transfer = async (recipient, amount) => {
// 	console.log(recipient, amount);
// 	await niceContract.methods
// 	  .transfer(recipient, amount)
// 	  .send({ from: account });
// 	await setAccountDetails(niceContract, account);
//   };

//   const handleReceipient = (e) => {
// 	setRecipient(e.target.value);
//   };

// 	const handleAmount = (e) => {
// 		setAmount(e.target.value);
// 	};

//   const onSelectChange = (e) => {
// 	setAccountDetails(niceContract, e.target.value);
//   };
  const createNewWallet = () => {
	var randomSeed = lightwallet.keystore.generateRandomSeed();

	var infoString = 'Your new wallet seed is: "' + randomSeed +
	  '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
	  'Please enter a password to encrypt your seed while in the browser.';
	var password = prompt(infoString, 'Password');

	lightwallet.keystore.createVault({
	  password: password,
	  seedPhrase: randomSeed,
	  //random salt
	  hdPathString: 'm/0\'/0\'/0\''
	}, function (err, ks) {
		setKeyStore(ks)
		ks.keyFromPassword(password, function (err, pwDerivedKey) {
			if (err) throw err;
			ks.generateNewAddress(pwDerivedKey, 1) 
			let addr = ks.getAddresses();
			setNewAccountAddress(addr[0])
			getBalance(addr[0])
	  	})
	});
  }
  const restoreWallet = () => {
	var password = prompt('Enter Password to encrypt your seed', 'Password');

		lightwallet.keystore.createVault({
			password: password,
			seedPhrase: document.getElementById('seed').value,
			//random salt
			hdPathString: 'm/0\'/0\'/0\''
		}, function (err, ks) {
			setKeyStore(ks)
			ks.keyFromPassword(password, function (err, pwDerivedKey) {
				if (err) throw err;
				ks.generateNewAddress(pwDerivedKey, 1) 
				let addr = ks.getAddresses();
				setNewAccountAddress(addr[0])
				getBalance(addr[0])
			  })
        });
  }
  async function getBalance(address) {
	// instantiate by address
	const web3 = window.web3;
	// var bal = await niceContract.methods.balanceOf(address).call();
	// console.log('Balance', bal)
	// setNewAccountBalance(web3.utils.fromWei(bal.toString()))
	let bal = await web3.eth.getBalance(address)
	setNewAccountBalance(web3.utils.fromWei(bal))
  }
	const onChangePhrase = (e) => {
		setPhrase(e.target.value)
	}
	const exportPrivateKey = () => {
		var password = prompt("Type your password", 'Password');
		
		keyStore.keyFromPassword(password, function (err, pwDerivedKey) {
			if (err) throw err;
			console.log("newAccountAddress", newAccountAddress)
			let privateKey = keyStore.exportPrivateKey(newAccountAddress, pwDerivedKey)
			setPrivateKey(privateKey)
		})

	}
  return (
	<div>
		<h2>New Wallet</h2>
		<div>
			<button onClick={createNewWallet}>Create New Wallet</button>
		</div>
		<h2>Restore Wallet</h2>
		<div>
			<input id="seed" size="80" type="text" onChange={onChangePhrase} value={phrase} />
			<button onClick={restoreWallet}>Restore Wallet</button>
		</div>
		<h2>Export private key</h2>
		<div>
			<button onClick={exportPrivateKey}>Export Private Key</button>
		</div>
		<div>
			{newAccountAddress ? 
				<h5>Wallet address : {newAccountAddress}</h5>
				: ""
			}
			{newAccountBalance ? 
				<h5>Balance: {newAccountBalance}</h5>
				: ""
			}
			{privateKey ? 
				<h5>Private Key: {privateKey}</h5>
				: ""
			}
		</div>
	</div>
  );
}

export default Wallet;

{/* <div className="App">
	  <div className="m-5" style={{ width: "600px" }}> */}
		{/* <img src={logo} className="App-logo" alt="logo" /> */}
		{/* <div>
		  <h3> Select From Account: </h3>
		  <select id="acc" onChange={(e) => onSelectChange(e)}>
			{accounts.map((accAddress) => (
			  <option value={accAddress} key={accAddress}>
				{accAddress}
			  </option>
			))}
		  </select>
		</div>
		<h1 className="mt-3">{balance + " Nice"}</h1>
		<p></p>
		<form
		  onSubmit={(event) => {
			event.preventDefault();
			const value = window.web3.utils.toWei(amount, "Ether");
			console.log(recipient, value);
			transfer(recipient, value);
		  }}
		>
		  <h4 className="mt-5"> Sent to </h4>
		  <div>
			<input
			  id="recipient"
			  type="text"
			  onChange={(e) => handleReceipient(e)}
			  className="form-control"
			  placeholder="Recipient Address"
			  required
			/>
		  </div>
		  <div className="mt-2">
			<input
			  id="amount"
			  type="text"
			  onChange={(e) => handleAmount(e)}
			  className="form-control"
			  placeholder="Amount"
			  required
			/>
		  </div>
		  <button type="submit" className="btn btn-primary mt-2">
			Send Nice
		  </button>
		</form>
	  </div>
	</div> */}