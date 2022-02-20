# Booking Room DApp

This is an Ethereum based decentralized booking application prototype.

## Prerequisites

- NodeJs: ^16.13.2
- NPM: ^8.1.2
- MetaMask: ^10.9.3

## Setup

1. Go to client folder:
```sh
cd client
```
2. Install dependencies:
```sh
npm install
```
3. Follow the  [MetaMask guidelines](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) to add a custom network RPC for the local blockchain:
    - **Network name**: Ganache
    - **New RPC URL**: http://localhost:8545
    - **Chain ID**: 1337
4. Admin account's address is hard-coded in the configuation and you have to import it in your wallet to use the admin panel. [Follow the steps here](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) and import the following private key:
```
0xa6caff9838f6942575eacd4bdbf60edb40932d7926abaeed9016838f66c94c63
```
5. Create at least 2 other accounts on MetaMask, name the accounts "Coke Employee" and "Pepsi Employee" to differentiate them from admin's account.

## Run

- Run start script:
```sh
npm start
```

This will start local blockchain (Ganache) on port 8545, compile / deploy contracts and run the development server. It will take some time. If you have any conflict with the port number, you can change it in truffle-config file. After running the development server, you will be redirected to http://localhost:3000.

## Usage
 - You can read a short overview of different parts of the application on the start page.
 - First you have to add employee wallets, this will grant them permission to book the meeting rooms.
 - Go to the "Admin Panel".
 - Click on "Connect with MetaMask" button.
 - Select the admin account that you have imported previously and click on "Connect".
 - If you get an `Internal JSON-RPC error` from MetaMask, just change the network to any other one, then switch back to Ganache. It should resolve the issue.
 - Select the company in the dropdown menu and enter Coke/Pepsi employee's Ethereum address in the input field.
 - Click on "Add Employee" to whitelist the employee's address. You can remove it later by clicking on "Remove employee".
 - Confirm the transaction, it takes some time to execute (~= 10sec). After the execution you will be notified by a toaster.
 - Switch to one of the employees MetaMask account, either in the same browser or in a different instance.
 - Go to his/her company's booking page and connect his/her wallet.
 - Select a room to display time slots, book any time slot that you want.
 - Repeat the process wiht other employee(s).

## Caveat
When you restart the blockchain, **you have to reset all MetaMask accounts you used before** [as explained here](https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-your-wallet). If you forget to do it, all your transactions will stuck and displayed as "pending". The reason is that account nonces are reset when the blockchain restarts and MetaMask doesn't know about it. Alternatively, you can use custom nonce is MetaMask, [as explained here](https://metamask.zendesk.com/hc/en-us/articles/360015489251).