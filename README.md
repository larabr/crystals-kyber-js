<h1 align="center">crystals-kyber-js</h1>

<div align="center">
</div>

<div align="center">
A CRYSTALS-KYBER implementation written in TypeScript for various JavaScript runtimes. This module is based on <a href="https://github.com/antontutoveanu/crystals-kyber-javascript">ntontutoveanu/crystals-kyber-javascript</a> published under <a href="https://github.com/antontutoveanu/crystals-kyber-javascript/blob/main/License">the MIT license</a>.
</div>

```js
import { Kyber768 } from "crystals-kyber-js";

async function doKyber() {
  // A recipient generates a key pair.
  const recipient = new Kyber768(); // Kyber512 and Kyber1024 are also available.
  const [pkR, skR] = await recipient.generateKeyPair();

  // A sender generates a ciphertext and a shared secret
  // by using the recipient's public key.
  const sender = new Kyber768();
  const [ct, ssS] = await sender.encap(pkR);

  // The recipient decapsulates the ciphertext and generates the samle shared secret
  // by using the recipient's private key.
  const ssR = await recipient.decap(skR, ct);

  // ssS === ssR
  return;
}

try {
  doKyber();
} catch (err) {
  console.log("failed: ", err.message);
}
```

## Index

- [Installation](#installation)
  - [Node.js](#nodejs)
  - [Deno](#deno)
  - [Web Browsers](#web-browsers)
  - [Cloudflare Workers](#cloudflare-workers)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

### Node.js

Using npm:

```sh
npm install crystals-kyber-js
```

Using yarn:

```sh
yarn add crystals-kyber-js
```

### Deno

Using deno.land:

```js
// use a specific version
import { Kyber768 } from "https://deno.land/x/crystals-kyber@0.1.0/mod.ts";

// use the latest stable version
import { Kyber768 } from "https://deno.land/x/crystals-kyber/mod.ts";
```

### Web Browsers

Followings are how to use this module with typical CDNs. Other CDNs can be used
as well.

Using esm.sh:

```html
<!-- use a specific version -->
<script type="module">
  import { Kyber768 } from "https://esm.sh/crystals-kyber-js@0.1.0";
  // ...
</script>

<!-- use the latest stable version -->
<script type="module">
  import { Kyber768 } from "https://esm.sh/crystals-kyber-js";
  // ...
</script>
```

Using unpkg:

```html
<!-- use a specific version -->
<script type="module">
  import { Kyber768 } from "https://unpkg.com/crystals-kyber-js@0.1.0";
  // ...
</script>
```

### Cloudflare Workers

```sh
git clone git@github.com:dajiaji/crystals-kyber-js.git
cd crystals-kyber-js
npm install -g esbuild
deno task dnt
deno task minify > $YOUR_SRC_PATH/crystals-kyber.js
```

## Usage

This section shows some typical usage examples.

### Node.js

```js
import { Kyber768 } from "crystals-kyber-js";
// const { Kyber768 } = require("crystals-kyber-js");

async function doKyber() {
  // A recipient generates a key pair.
  const recipient = new Kyber768(); // Kyber512 and Kyber1024 are also available.
  const [pkR, skR] = await recipient.generateKeyPair();

  // A sender generates a ciphertext and a shared secret
  // by using the recipient's public key.
  const sender = new Kyber768();
  const [ct, ssS] = await sender.encap(pkR);

  // The recipient decapsulates the ciphertext and generates the samle shared secret
  // by using the recipient's private key.
  const ssR = await recipient.decap(skR, ct);

  // ssS === ssR
  return;
}

try {
  doKyber();
} catch (err) {
  console.log("failed: ", err.message);
}
```

### Deno

```js
import { Kyber512 } from "https://deno.land/x/crystals-kyber@0.1.0/mod.ts";

async function doKyber() {

  // A recipient generates a key pair.
  const recipient = new Kyber512();
  const [pkR, skR] = await recipient.generateKeyPair();

  // A sender generates a ciphertext and a shared secret
  // by using the recipient's public key.
  const sender = new Kyber512();
  const [ct, ssS] = await sender.encap(pkR);

  // The recipient decapsulates the ciphertext and generates the samle shared secret
  // by using the recipient's private key.
  const ssR = await recipient.decap(skR, ct);

  // ssS === ssR
  return;
}

try {
  doKyber();
} catch (_err: unknown) {
  console.log("failed.");
}
```

### Browsers

```html
<html>
  <head></head>
  <body>
    <script type="module">
      import { Kyber1024 } from "https://esm.sh/crystals-kyber@0.1.0";

      globalThis.doKyber = async () => {
        try {
          // A recipient generates a key pair.
          const recipient = new Kyber1024();
          const [pkR, skR] = await recipient.generateKeyPair();

          // A sender generates a ciphertext and a shared secret
          // by using the recipient's public key.
          const sender = new Kyber1024();
          const [ct, ssS] = await sender.encap(pkR);

          // The recipient decapsulates the ciphertext and generates the samle shared secret
          // by using the recipient's private key.
          const ssR = await recipient.decap(skR, ct);

          // ssS === ssR
          return;
        } catch (err) {
          alert("failed: ", err.message);
        }
      }
    </script>
    <button type="button" onclick="doKyber()">do CRYSTALS-KYBER</button>
  </body>
</html>
```

## Contributing

We welcome all kind of contributions, filing issues, suggesting new features or
sending PRs.
