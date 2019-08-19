## JavaScript Card Exchange Engine (JCEE)

A blockchain app for trading card game creators. JCEE manages card ownership and rarity for your game's players. The app is still in development, so check here later for updated instuctions.
___

**Installation**

1. If you don't have Node.js installed on your Mac, then you must install it. I suggest following the linked instructions to install [Homebrew](http://osxdaily.com/2018/03/07/how-install-homebrew-mac-os/) first, and then [Node.js](http://osxdaily.com/2018/06/29/how-install-nodejs-npm-mac/).
2. Clone or download this repo. Then, from the root directory, run `npm install` to install the app's dependencies.
3. Use `npm run test` to make sure the code is functioning properly. (Use **ctrl + c** to exit the test suite.)

**Usage**

Let's start two nodes of the JCEE chain on your local machine, and then we'll do a currency transaction. JavaScript Card Exchange Engine comes with a built-in token system, and the tokens can be used as an in-app currency. We'll do the transaction using these tokens. In order to see the transaction clearly, we'll [Postman](https://www.getpostman.com/products), so please download it using the link.

1. Launch your Mac terminal and open two panes (**cmd + d**). Navigate to the jcee root directory in both.
2. Use `npm run dev` to fire up a jcee blockchain node in one terminal pane. You'll see the port at which the node is listening printed to the console. Additionally, you'll see the node's wallet public key and starting balance.
3. In your second terminal pane, use `npm run dev-peer` to fire up another node. This node will automatically sync with the previous one, and you'll see a different port and wallet public key prinited to the console. As proof that the sync is successful, you'll see the genesis block printed to the console as well (its hash will be shown as `'genesis'`).
4. Now, open Postman and configure a GET request to send the first node. We'll use the `/blocks` endpoint, so the uri will look like this `http://localhost:3000/api/blocks`. Send the request, and Postman should return the genesis block. It will look like this:
```
[
    {
        "timestamp": 1,
        "prevHash": "unknown",
        "hash": "genesis",
        "data": [],
        "nonce": 0,
        "difficulty": 3
    }
]
```
5. Next, we'll check our transaction pool by sending another GET request to the same node, using the `/transaction-pool-map` endpoint. The uri will look like this: `http://localhost:3000/api/transaction-pool-map`. The response will be an empty object (`{}`) because we have not done any transactions.
6. Use the `/transact` endpoint to make a POST request to this very same node. Set Postman to POST, and use a uri that will looks like this: `http://localhost:3000/api/transact`. Then, open Postman's Body tab and select **raw**. Set the dropdown menu to **JSON(application/json)**. Next, put the following JSON data into the body and click **send**:
```
{
	"recipient": "foo",
	"amount": 50
}
```
7. The transaction is now in the transaction pool, and both nodes have access to it. You can view the updated transaction pool by using the `/transaction-pool` endpoint and sending a GET request to either node. But in order to complete the transaction, a new block must be mined. Use Postman to make a GET request to the `/mine-transaction` endpoint. This can be sent to either node. Your uri may look like either of these: `http://localhost:3000/api/mine-transactions` or `http://localhost:3235/api/mine-transactions`, depending on the ports that your nodes are using. The response will show that a new block, with our new transaction data, has been added to the chain. Each node will update its copy of the chain, and you can view this by using the `/blocks` endpoint to make a GET request to either node.
8. Have fun.