import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider(global._env_.REACT_APP_WEB3_PROVIDER)
);

export default web3;
