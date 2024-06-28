import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [cost, setcost] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getcost = async() => {
    if (atm) {
      setcost((await atm.getcost()).toNumber());
    }
  }


  const dest = async(event) => {
    event.preventDefault()
    if (atm) {
      const se=document.querySelector("#Destination");
      const id = se.options[se.selectedIndex].id;
      console.log(id);
      let tx = await atm.destination(id);
      await tx.wait()
      const set=document.querySelector("#H");
      const id1 = set.options[set.selectedIndex].id;
      let txn = await atm.hotel(id1);
      console.log(id1);
      await txn.wait()
      getcost();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (cost == undefined) {
      getcost();
    }
    return (
      <div>
        <p>Your Account: {account}</p>
        
        <p>Your Cost: {cost}</p>
        <form onSubmit={dest}>
          <select id="Destination">
          <option id="1">Ram Mandir</option>
          <option id="2">Dwarka</option>
          <option id="3">Konark</option>
          <option id="4">Jagannath</option>
          </select>
          <br></br>
          <select id="H">
          <option id="3">3 star</option>
          <option id="4">4 star</option>
          <option id="5">5 star</option>
          <option id="7">7 star</option>
          </select>
          <br></br>
          <button>Submit</button>
        </form>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters Travel Agency</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
