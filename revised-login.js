const { Builder, Capabilities, By, until } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/edge');
const path = require('path');
const fs = require('fs');

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

async function logStatus(message, code) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [STATUS ${code}] ${message}`);
}

async function testFullFlow(browser) {
    let driver;
    try {
        driver = await createDriver(browser);
        await driver.get('https://open.rocket.chat/home');
        logStatus('Navigated to Rocket.Chat homepage', 200);

        // Login
        const usernameField = await driver.wait(until.elementLocated(By.name('usernameOrEmail')), 150000);
        const passwordField = await driver.wait(until.elementLocated(By.name('password')), 150000);
        const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 150000);
        await usernameField.sendKeys('winterashh88@gmail.com');
        await passwordField.sendKeys('Password123!');
        await loginButton.click();
        await driver.wait(until.urlContains('/home'), 150000);
        logStatus('TC_AUTH_01 Login successful', 201);

        // Navigate to message channel
        const messageChannel = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[3]/div[1]/nav/div[1]/div/div[1]/div[2]/div/div[1]/a/div[3]')), 150000);
        await messageChannel.click();

        // Send a message
        const messageBox = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[3]/main/div/div/div/div/div/div/section/div/div/footer/div[1]/textarea')), 150000);
        messageBox.sendKeys('Hello, this is a test message!');
        const sendButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[3]/main/div/div/div/div/div/div/section/div/div/footer/div[1]/div[2]/div[2]/button/i')), 150000);
        await sendButton.click();
        logStatus('TC_MSG_01 Message sent successfully', 201);

        // Upload a file
        const uploadButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[3]/main/div/div/div/div/div/div/section/div/div/footer/div[1]/div[2]/div[1]/button[10]/i')), 150000);
        await uploadButton.click();
        const filePath = path.resolve(__dirname, 'test.txt');
        const fileInput = await driver.wait(until.elementLocated(By.css('input[type="file"]')), 150000);
        await fileInput.sendKeys(filePath);
        const confirmUploadButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div/dialog/form/div/div[2]/div/button[2]')), 150000);
        await confirmUploadButton.click();
        logStatus('TC_FILE_01 File uploaded successfully', 201);

        // Logout
        const profileAvatarButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/nav/span[2]/div[2]/button/figure/img')), 150000);
        await profileAvatarButton.click();
        const logoutButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/nav/span[2]/div[2]/div/div/div/div[4]/div/label/div/div[2]')), 150000);
        await logoutButton.click();
        logStatus('TC_AUTH_03 Logout successful', 200);

        console.log(`TC_FULL_FLOW_01 (${browser}): Pass`);
        return { status: 'Pass' };
    } catch (error) {
        logStatus(`Test failed: ${error.message}`, 500);
        return { status: 'Fail', error: error.message };
    } finally {
        if (driver) await driver.quit();
    }
}

async function runTests() {
    const browsers = ['chrome', 'edge'];
    const results = {};

    for (const browser of browsers) {
        results[browser] = await testFullFlow(browser);
    }

    console.log('\nTest Results:', results);
}

runTests().catch(console.error);
