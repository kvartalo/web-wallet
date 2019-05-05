# web-wallet
kvartalo web wallet app



## Usage
```
npm install
```

And then serve in a server, remember that the contents shoule be served with https to allow camera QR scanning. 

If you just want to test in the mobile, an option is to use the live-server-https package:

```
npm i -g live-server live-server-https
live-server --https=`npm root -g`/live-server-https
```

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
