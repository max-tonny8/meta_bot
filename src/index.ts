import path from 'path';
import * as bip39 from 'bip39';
import puppeteer from 'puppeteer';
import * as dappeteer from '@chainsafe/dappeteer';

const METAMASK_PATH = path.resolve(__dirname, '..', 'metamask');

async function main() {
  const browser = await dappeteer.launch(puppeteer, {
    metamaskLocation: METAMASK_PATH,
    metamaskVersion: 'v10.8.1',
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const seed = bip39.generateMnemonic();

  console.log('mnemonic:', seed);

  const metamask = await dappeteer.setupMetamask(browser, { seed });

  await metamask.page.waitForTimeout(1000);

  const context = browser.defaultBrowserContext();

  context.overridePermissions(metamask.page.url(), ['clipboard-read']);

  const copyAddrButton = await metamask.page.waitForSelector('.selected-account__clickable');

  await copyAddrButton?.click();

  const address = await metamask.page.evaluate(() => navigator.clipboard.readText());

  console.log('address:', address);

  const balance = await metamask.getTokenBalance('ETH');

  console.log('balance:', balance);
}

main();
