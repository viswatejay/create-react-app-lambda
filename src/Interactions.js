import { React, useState } from "react";
import styles from "./Wallet.module.css";

const Interactions = (props) => {
  const [transferHash, setTransferHash] = useState();

  const transferHandler = async (e) => {
    e.preventDefault();
    let transferAmount = (
      Number(e.target.sendAmount.value) *
      10 ** Number(props?.decimals)
    ).toLocaleString("fullwide", {
      useGrouping: !1,
    });
    let recieverAddress = e.target.recieverAddress.value;
    let txt;
    console.log("transferAmount", transferAmount);
    if (props.type == 1) {
      txt = await props.contract.methods
        .transfer(recieverAddress, transferAmount)
        .send({ from: props?.walletAddress });
    } else if (props.type == 2) {
      txt = await props.contract.methods
        .mint(recieverAddress, transferAmount)
        .send({ from: props?.walletAddress });
    } else if (props.type == 3) {
      txt = await props.contract.methods
        .burn(recieverAddress, transferAmount)
        .send({ from: props?.walletAddress });
    }
    console.log(txt);
    setTransferHash(txt);
    props?.updateBalance();
  };

  return (
    <div
      className={
        props?.type == 1
          ? styles.interactionsCard
          : props?.type == 2
          ? styles.interactionsCard2
          : styles.interactionsCard3
      }
    >
      <form onSubmit={transferHandler}>
        <h3> {`${props?.text} Coins`}</h3>
        <p> {props?.text} Address </p>
        <input
          type="text"
          id="recieverAddress"
          className={styles.addressInput}
        />

        <p> {props?.text} Amount </p>
        <input
          type="number"
          id="sendAmount"
          min="0"
          step="1"
          className={styles.inputbox}
        />

        <button type="submit" className={styles.button6}>
          {props?.text}
        </button>
        {transferHash?.status ? (
          <a
            href={
              "https://explorer.5ire.network/evm/tx/" +
              transferHash.transactionHash
            }
            target="_blank"
          >
            View Transaction on explorer
          </a>
        ) : null}
      </form>
    </div>
  );
};

export default Interactions;
