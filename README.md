# Make a basic dapp with functions

In this project we have made dapp on our localhost 3000 with a smart contract deployed with the help of hardhat and nodejs tools. We integrate frontend to our contract so that we can work on dapps.

# Description

We have used hardhat to make nodes or accounts with some balance of ethers and on the given nodes or accounts we deploy our contract in sol file we make and deploy.js file in the scripts folder. After that we develop our index.js with all the functionalites corresponding to the functions in contract. And then we deploy our frontend on localhost 3000 to test the functionalities.

# Commands

1. type: npm i to initialize the nodejs
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. Make sure you have created a sol file in contracts folder and deploy.js in scripts folder.
```Assessment.sol
   // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
   uint cost=0;
   function destination(uint fav_dest) public  {
    cost=0;
      if(fav_dest==1){
        cost+=1000;
      }
      else if(fav_dest==2){
        cost+=2000;
      }
      else if(fav_dest==3){
        cost+=3000;
      } 
      else{
        cost+=4000;
      }
   }
   function hotel(uint star) public {
    if(star==3){
      cost+=200;
    }
    else if(star==4){
      cost+=300;
    }
    else{
      cost+=500;
    }
    
   }
   function getcost() public view returns(uint){
    return cost;
   }
}


```

file 2 in scripts

 ``` deploy.js
const hre = require("hardhat");

async function main() {
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy();
  await assessment.deployed();

  console.log(`A contract deployed to ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

```

5. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
6. Now before going further make your index.js file in the pages folder.

```index.js
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
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
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
```

6. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

# Author
Hardik
hardikxibscience238@gmail.com

