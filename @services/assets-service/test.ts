import { DefaultHttpApiBridge, type IHttpApiBridge } from 'conjure-client'
import { AssetsService } from './types/typescript/index'
import * as fs from 'node:fs'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const assetsService = new AssetsService(new DefaultHttpApiBridge({
  baseUrl: "https://localhost:8113",
  userAgent: {
    productName: 'example',
    productVersion: '1.0.0',
  },
}));

const file = fs.readFileSync('/Users/arthurfontaine/Downloads/test.png');

const rawBinaryString = file.toString('base64');

assetsService.upload({
  data: rawBinaryString,
  name: 'test.png',
  type: 'MEDIA_IMAGE',
})
  .catch((err) => {
    console.error(err);
  });
