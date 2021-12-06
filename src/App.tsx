import React from "react";
import "./App.css";
import Web3 from "web3";
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
export const getSignature = (address: string): any => {
  let web3: any;
  console.log(address, "address");
  const _message = `Sign this message to login with address ${address}`;
  if (web3) {
    return new Promise<any>((resolve: (value: string) => void, reject) => {
      web3.eth.personal
        .sign(_message, address)
        .then((signature: string) => {
          resolve(signature);
        })
        .catch((err: any) => reject(err));
    });
  }
};
const App: React.FC = () => {
  const [address, setAddress] = React.useState("");
  const handleConnectMetaMask = async () => {
    if (!window.ethereum) {
      setAddress("");
      return;
    }
    window.web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signature = (await getSignature(accounts[0])) as string;
      const payload = {
        username: accounts[0],
        password: signature,
        message: `Sign this message to login with address ${accounts[0]}`,
      };
      setAddress(payload && payload.username);
    } catch (err: any) {
      setAddress("");
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <div onClick={handleConnectMetaMask} className="meta-mask">
          <span>Connect to wallet </span>
        </div>
        {address && <div>Address: {address}</div>}
      </header>
    </div>
  );
};
export default App;
