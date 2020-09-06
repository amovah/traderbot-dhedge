import web3 from "./web3";

const smartContract = new web3.eth.Contract(
  [
    {
      constant: false,
      inputs: [
        {
          internalType: "bytes32",
          name: "sourceKey",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "sourceAmount",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "destinationKey",
          type: "bytes32",
        },
      ],
      name: "exchange",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getFundComposition",
      outputs: [
        {
          internalType: "bytes32[]",
          name: "",
          type: "bytes32[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
  global._env_.REACT_APP_SMART_CONTRACT_ADDRESS
);

export default smartContract;
