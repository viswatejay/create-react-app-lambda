import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Wallet.module.css";
import simple_token_abi from "./Contracts/simple_token_abi.json";
import Interactions from "./Interactions";
import Web3 from "web3";

const Wallet = () => {
  // deploy simple token contract and paste deployed contract address here. This value is local ganache chain
  let contractAddress = "0x076d0806b41d3AcC3ca141A267A212d206350cAF";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [decimals, setDecimals] = useState();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [tokenName, setTokenName] = useState("Token");
  const [balance, setBalance] = useState(null);
  const [transferHash, setTransferHash] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const updateBalance = async () => {
    let balanceBigN = await contract.methods.balanceOf(defaultAccount).call();

    let tokenDecimals = await contract.methods.decimals().call();
    setDecimals(tokenDecimals);
    console.log("contract", balanceBigN);
    let tokenName = await contract.methods.name().call();
    setTokenName(tokenName);

    setBalance(toFixed(Number(balanceBigN) / 10 ** Number(tokenDecimals)));
  };

  function toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    return x;
  }

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateEthers = () => {
    const { ethereum } = window;

    let web3Object = new Web3(ethereum);
    let Instance = new web3Object.eth.Contract(
      simple_token_abi,
      contractAddress
    );
    console.log("tempContract", Instance);
    setContract(Instance);
  };

  useEffect(() => {
    if (contract != null) {
      updateBalance();
      //   updateTokenName();
    }
  }, [contract]);

  //   const updateTokenName = async () => {
  //     setTokenName(await contract.methodsname());
  //   };

  return (
    <div>
      <h2> {tokenName + " ERC-20 Wallet"} </h2>
      <button className={styles.button6} onClick={connectWalletHandler}>
        {connButtonText}
      </button>
      <div className={styles.walletCard}>
        <div>
          <h3>Address: {defaultAccount}</h3>
        </div>

        <div>
          <h3>
            {tokenName} Balance: {balance}
          </h3>
        </div>

        {errorMessage}
      </div>
      <Interactions
        contract={contract}
        walletAddress={defaultAccount}
        text={"Transfer"}
        type={1}
        updateBalance={updateBalance}
        decimals={decimals}
      />
      <br />
      <Interactions
        contract={contract}
        walletAddress={defaultAccount}
        text={"Mint"}
        type={2}
        updateBalance={updateBalance}
        decimals={decimals}
      />
      <br />
      <Interactions
        contract={contract}
        walletAddress={defaultAccount}
        text={"Burn"}
        type={3}
        updateBalance={updateBalance}
        decimals={decimals}
      />
    </div>
  );
};

export default Wallet;
