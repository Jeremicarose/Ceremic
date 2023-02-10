import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const web3ModalRef = useRef();

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const wrappedProvider = new Web3Provider(provider);
    return wrappedProvider;
  };

  const [connection, connect, disconnect] = useViewerConnection();
  useEffect(() => {
    if (connection.status !== "connected") {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [connection.status]);

  const connectToSelfID = async () => {
    const ethereumAuthProvider = await getEthereumAuthProvider();
    connect(ethereumAuthProvider);
  };

  const getEthereumAuthProvider = async () => {
    const wrappedProvider = await getProvider();
    const signer = wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  };

  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}>Ceramic Demo</span>
        {connection.status === "connected" ? (
          <span className={styles.subtitle}>Connected</span>
        ) : (
          <button
            onClick={connectToSelfID}
            className={styles.button}
            disabled={connection.status === "connecting"}
          >
            Connect
          </button>
        )}
      </div>
  
      <div className={styles.content}>
        <div className={styles.connection}>
          {connection.status === "connected" ? (
            <div>
              <span className={styles.subtitle}>
                Your 3ID is {connection.selfID.id}
              </span>
              <RecordSetter />
            </div>
          ) : (
            <span className={styles.subtitle}>
              Connect with your wallet to access your 3ID
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordSetter() {
  const [record, setRecord] = useState();
  const [key, setKey] = useState();
  const [value, setValue] = useState();
  const [connection] = useViewerConnection();

  const setRecordValue = async () => {
    const record = await connection.selfID.createRecord(key, value);
    setRecord(record);
  };

  return (
    <div>
      <div className={styles.inputContainer}>
        <span className={styles.subtitle}>Key</span>
        <input
          className={styles.input}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <div className={styles.inputContainer}>
        <span className={styles.subtitle}>Value</span>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button className={styles.button} onClick={setRecordValue}>
        Set Record
      </button>
      {record && (
        <div className={styles.recordContainer}>
          <span className={styles.subtitle}>Record</span>
          <div className={styles.record}>
            <span className={styles.subtitle}>Key</span>
            <span className={styles.subtitle}>{record.key}</span>
            <span className={styles.subtitle}>Value</span>
            <span className={styles.subtitle}>{record.value}</span>
          </div>
        </div>
      )}
    </div>
  );
}
