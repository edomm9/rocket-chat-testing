# Rocket.Chat Full Login, Message, File Upload, and Logout Test

This project contains a Selenium WebDriver test script for automating a full flow on Rocket.Chat, including login, sending a message, uploading a file, and logging out.

## Features

* Automated login to Rocket.Chat
* Sending a test message to a channel
* File upload functionality
* Proper status logging with status codes for each step
* Graceful error handling and resource cleanup

## Prerequisites

1. **Node.js** (version 18 or later)

   * Download from [Node.js official website](https://nodejs.org/)
   * Verify installation:

     ```bash
     node -v
     npm -v
     ```

2. **Selenium WebDriver**

   * Install using npm:

     ```bash
     npm install selenium-webdriver
     ```

3. **Microsoft Edge Driver (msedgedriver)**

   * Download the Edge WebDriver matching your browser version from [Microsoft Edge WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
   * Place the `msedgedriver.exe` file in the root directory of this project.

4. **Rocket.Chat Account**

   * Ensure you have a valid Rocket.Chat account and the necessary permissions to access the target channel.

## Setup

1. Clone this repository or download the script files.
2. Place the `msedgedriver.exe` file in the project root.
3. Update the credentials in the script if needed:

   ```javascript
   const username = 'your-email@example.com';
   const password = 'your-password';
   ```
4. Create a file named `test.txt` in the root directory for the file upload test.

## Running the Script

To run the test, use the following command:

```bash
node rocket-chat-test.js
```

## Expected Output

* The script will log status messages like:

  ```
  [2025-05-16T12:34:56.789Z] [STATUS 200] Navigated to Rocket.Chat homepage
  [2025-05-16T12:34:57.890Z] [STATUS 201] Login successful
  [2025-05-16T12:34:58.901Z] [STATUS 201] Message sent successfully
  [2025-05-16T12:34:59.012Z] [STATUS 201] File uploaded successfully
  [2025-05-16T12:35:00.123Z] [STATUS 200] Logout successful
  ```

## Troubleshooting

* **Module Not Found Error**

  * Make sure you have installed all required packages using npm.

* **Timeout Error**

  * If any step takes too long, consider increasing the timeout values in the script.

## License

MIT License

## Contact

For any issues or contributions, feel free to reach out.
