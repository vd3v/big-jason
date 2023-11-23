# Big Jason

[<img src="https://github.com/vd3v/big-jason/assets/12663045/70a6c349-19b0-4e02-9dfa-7c4b20c6f28e">](https://www.npmjs.com/package/big-jason)




<p align="center" width="100%">
  <img src="https://github.com/vd3v/big-jason/assets/12663045/06358d08-99fc-4bf0-b2aa-761bbc57fdae" data-canonical-src="https://github.com/vd3v/big-jason/assets/12663045/06358d08-99fc-4bf0-b2aa-761bbc57fdae" width="200" height="400" />
</p>

JSON.parse but uses BigInt for big numbers.
It was designed for being used in nodeJS environment to replace other soltions that are manually parsing JSON string character by character.
It is using standard JSON.parse under the hood and is relatively lean in terms of memory consumption, but it has limited browser support, [see here](https://caniuse.com/js-regexp-lookbehind).

For better browser support, use [json-bigint](https://www.npmjs.com/package/json-bigint) instead.

### Getting Started

`npm install big-jason`

### Usage

```javascript
import { BigJason } from 'big-jason'

const parsed = BigJason.parse(exampleJSONString)
const stringified = BigJason.stringify(exampleObject)
```
