import React, { useCallback, useState, useMemo } from "react";
import logo from "./astar.png";
import "./App.css";
import "./toggle-button.css";
import * as polkadotCryptoUtils from "@polkadot/util-crypto";
import * as polkadotUtils from "@polkadot/util";

const SS58_PREFIX = 5;

export enum NETWORKS {
  kusama = 'kusama',
  statemine = 'statemine',
}

const apiProviderConfig = {
  [NETWORKS.kusama]: {
      id: NETWORKS.kusama,
      wsProviderUrl: 'wss://kusama-rpc.polkadot.io',
  },
  [NETWORKS.statemine]: {
      id: NETWORKS.statemine,
      wsProviderUrl: 'wss://kusama-statemine-rpc.paritytech.net',
  },
}

function App() {
  const [addressType, setAddressType] = useState<"H160" | "SS58">("SS58");
  const [addressInput, setAddressInput] = useState<string>("");
  const [addressPrefix, setAddressPrefix] = useState(SS58_PREFIX);

  const plmToEvm = useCallback(() => {
    if (
      addressInput &&
      addressType === "SS58" &&
      polkadotCryptoUtils.checkAddress(addressInput, addressPrefix)[0]
    ) {
      return polkadotUtils.u8aToHex(
        polkadotCryptoUtils.addressToEvm(addressInput, true)
      );
    } else {
      if (!addressInput) {
        return "Please enter address";
      } else {
        return "Invalid";
      }
    }
  }, [addressInput, addressType, addressPrefix]);

  const evmToPlm = useCallback(() => {
    if (
      addressInput &&
      addressType === "H160" &&
      polkadotCryptoUtils.isEthereumAddress(addressInput)
    ) {
      return polkadotCryptoUtils.evmToAddress(addressInput, addressPrefix);
    } else {
      if (!addressInput) {
        return "Please enter address";
      } else {
        return "Invalid";
      }
    }
  }, [addressInput, addressPrefix, addressType]);

  const resultAddress = useMemo(() => {
    if (addressType === "H160") return evmToPlm();
    else return plmToEvm();
  }, [evmToPlm, plmToEvm, addressType]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Current address scheme: {addressType}</p>
      </header>
      <main className="App-main">
        <label className="switch">
          <input
            type="checkbox"
            onChange={() => {
              if (addressType === "H160") setAddressType("SS58");
              else setAddressType("H160");
            }}
          />
          <span className="slider round"></span>
        </label>
        <h3>Change address prefix</h3>
        <input
          type="text"
          value={addressPrefix}
          onChange={(e) => setAddressPrefix(Number.parseInt(e.target.value))}
        ></input>
        <h3>Input address</h3>
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        ></input>
        <div className="App-results">
        <h3>Results</h3>
        <p className="App-originalAddress">{addressInput}</p>
        <p className="App-convertAddress">{resultAddress}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
