# web-wallet
kvartalo web wallet app



## Usage
```
npm install
```

And then serve in a server.

### lib generation
This is already done.

- ethUtil
```
browserify index.js --standalone ethUtil > ethereumjs-util-browserified.js
```

- ethWallet
```
browserify index.js --standalone ethWallet > ethereumjs-wallet--browserified.js
```
