const { Builder, Capabilities } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/edge');
const path = require('path');

const edgeDriverPath = path.resolve(__dirname, 'msedgedriver.exe');

async function testBrowser(browser) {
    let driver;
    try {
        if (browser === 'edge') {
            // Configure Edge
            const serviceBuilder = new ServiceBuilder(edgeDriverPath);
            const edgeCapabilities = Capabilities.edge();
            edgeCapabilities.set('ms:edgeOptions', {
                args: ['--no-sandbox', '--disable-dev-shm-usage'],
                binary: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
            });
            driver = await new Builder()
                .forBrowser('MicrosoftEdge')
                .setEdgeService(serviceBuilder)
                .withCapabilities(edgeCapabilities)
                .build();
        } else {
            driver = await new Builder().forBrowser(browser).build();
        }
        await driver.get('https://open.rocket.chat');
        console.log(`${browser.charAt(0).toUpperCase() + browser.slice(1)}: Success`);
    } catch (error) {
        console.log(`${browser.charAt(0).toUpperCase() + browser.slice(1)}: Fail - ${error.message}`);
    } finally {
        if (driver) await driver.quit();
    }
}

async function testSetup() {
    await testBrowser('chrome');
    await testBrowser('edge');
}

testSetup();
