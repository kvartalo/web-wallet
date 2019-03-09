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
browserify index.js --standalone ethWallet > ethereumjs-wallet-browserified.js
```

- bip39
```
browserify index.js --standalone bip39 > bip39-browserified.js
```

- hdkey
```
browserify hdkey.js --standalone hdkey > hdkey-browserified.js
```

- instascan
```
browserify index.js --standalone instascan > instascan-browserified.js
```

- qrcode
```
browserify index.js --standalone qrcode > qrcode-browserified.js
```
