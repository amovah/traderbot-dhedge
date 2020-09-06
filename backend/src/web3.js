import Web3 from 'web3';
import Provider from '@truffle/hdwallet-provider';

const provider = new Provider(process.env.ETHER_PRIVATE_KEY, process.env.WEB3_PROVIDER);
const web3 = new Web3(provider);

export default web3;
