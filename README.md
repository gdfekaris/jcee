## JavaScript Card Exchange Engine (JCEE)

A blockchain app for trading card game creators. JCEE manages card ownership and rarity for your game's players. The app is still in development, so check here later for updated instuctions.
___

**Installation**

1. If you don't have Node.js installed on your Mac, then you must install it. I suggest following the linked instructions to install [Homebrew](http://osxdaily.com/2018/03/07/how-install-homebrew-mac-os/) first, and then [Node.js](http://osxdaily.com/2018/06/29/how-install-nodejs-npm-mac/).
2. Clone or download this repo. Then, from the root directory, run `npm install` to install the app's dependencies.
3. After installing the dependencies, use `npm run test` to make sure the code is functioning properly. Use ==ctrl + c== to exit the test suite.

**Usage**
Here, we'll get two nodes of the JCEE chain running on your local machine, and we'll do a currency transaction. JavaScript Card Exchange Engine comes with a built-in token system, and the tokens can be used as an in-app currency. We'll do our transaction using these tokens. In order to see our transactions clearly, we'll use the API development tool [Postman](https://www.getpostman.com/products), so please download it using the link.

1. Launch your Mac terminal and open two panes (==cmd + d==). Navigate to the jcee root directory in both.
2. In one pane, use `npm run dev` to fire up a jcee blockchain node. You'll see the port at which the node is listening, along with the node's wallet public key and starting balance printed to the console.
3. In the other terminal pane, use `npm run dev-peer` to fire up another node. This node will automatically sync with the previous one, and you'll see a different port and wallet public key prinited to the console. As proof that the sync was successful, you'll see the genesis block printed to the console as well (its hash will be shown as `'genesis'`).
4. Now, open Postman and configure a GET request to the first node. We'll use the `/blocks` api, so it will look something like this `http://localhost:3000/api/blocks`. Send the request, and Postman should return a printout of the genesis block. It will look like this:
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
5. Next, we'll check our transaction pool by sending another GET request to the same node, using the `/transaction-pool-map` api. Your request should look something like this: `http://localhost:3000/api/transaction-pool-map`. The response will return an empty object (`{}`), because we have not done any transactions.
6. To make a transaction, we'll create a POST request to this very same node, using the `/transact` api. Set Postman to POST, and the uri that you'll use will look something like this: `http://localhost:3000/api/transact`. Open Postman's Body tab, and select ==raw==. Then select ==JSON(application/json)== from the dropdown menu. Next, write the following in the body and click ==send==:
```
{
	"recipient": "foo",
	"amount": 50
}
```
6. We have just sent a transaction to the transaction pool. We can see the updated transaction pool by sending a GET request to either node, using the `/transaction-pool-map` api! Send a GET request to the first node using a uri that will look something like this: `http://localhost:3000/api/transaction-pool-map`, and then send a GET request to your second node, using a uri that will look something like this: `http://localhost:3186/api/transaction-pool-map`. Make sure the port numbers on each uri are correct, and you'll see that the nodes are synced, because they both have the same transaction pool!