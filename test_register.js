const { Builder, Capabilities, By, until } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/edge');
const path = require('path');

const edgeDriverPath = path.resolve(__dirname, 'msedgedriver.exe');

async function createDriver(browser) {
    try {
        if (browser === 'edge') {
            const serviceBuilder = new ServiceBuilder(edgeDriverPath);
            const edgeCapabilities = Capabilities.edge();
            edgeCapabilities.set('ms:edgeOptions', {
                args: ['--no-sandbox', '--disable-dev-shm-usage'],
                binary: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
            });
            return await new Builder()
                .forBrowser('MicrosoftEdge')
                .setEdgeService(serviceBuilder)
                .withCapabilities(edgeCapabilities)
                .build();
        } else {
            return await new Builder().forBrowser(browser).build();
        }
    } catch (error) {
        console.error(`Failed to create driver for ${browser}: ${error.message}`);
        throw error;
    }
}

async function testRegister(browser) {
    let driver;
    try {
        driver = await createDriver(browser);
        await driver.get('https://open.rocket.chat/home');

        // Wait for and click Create account link
        const createAccountLink = await driver.wait(until.elementLocated(By.linkText('Create an account')), 60000);
        await createAccountLink.click();

        // Wait for registration form
        const nameField = await driver.wait(until.elementLocated(By.name('name')), 15000);
        const emailField = await driver.wait(until.elementLocated(By.name('email')), 15000);
        const usernameField = await driver.wait(until.elementLocated(By.name('username')), 15000);
        const passwordField = await driver.wait(until.elementLocated(By.name('password')), 15000);
        const confirmField = await driver.wait(until.elementLocated(By.name('passwordConfirmation')), 15000);
        const registerButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 15000);

        // Enter registration details
        await nameField.sendKeys('Test User 2');
        await emailField.sendKeys('winterashh88@gmail.com');
        await usernameField.sendKeys('rngjngkjsgn');
        await passwordField.sendKeys('Password123!');
        await confirmField.sendKeys('Password123!');

        // Submit registration
        await registerButton.click();

        // Wait for successful registration (user menu appears)
        await driver.wait(until.elementLocated(By.css('.rc-header__user')), 15000);
        console.log(`TC_AUTH_02 (${browser}): Registration successful`);
        console.log('Pass');
        return { status: 'Pass' };
    } catch (error) {
        console.error(`TC_AUTH_02 (${browser}): Fail - ${error.message}`);
        return { status: 'Fail', error: error.message };
    } finally {
        if (driver) await driver.quit();
    }
}

async function runTests() {
    const browsers = ['chrome', 'edge'];
    const results = {};

    for (const browser of browsers) {
        results[browser] = await testRegister(browser);
    }

    console.log('\nTest Results:', results);
}

runTests().catch(console.error);