# Picture Picker

Picture Picker is an app that allows you to search the Pixabay API for images and view information about a selected image.

## To run the app:
### 1. Get a Pixabay Account

First, register for a Pixabay account here to obtain your own API key: https://pixabay.com/accounts/register/
After registering, you'll be able to view your API key in the Pixabay API docs: https://pixabay.com/api/docs/#api_search_images

### 2. Download the Expo App

In order to run the app, you'll also need to download the Expo Client app on your mobile device. 
It's available in both the App Store or Google Play Store. Picture Picker can run on both iOS and Android devices. 
Make sure that both your mobile device and the device running the code are connected to the same network.

### 3. Run the Code

Next, clone this repo on your device, open it, and find the `secrets_example.js` file at the root level of the folder. 
Change the name to `secrets.js`.
Then, replace `API_KEY_HERE` with your API key from Pixabay.
Run `npm install` in the command line to install any necessary dependencies. Then, run `npm start`. 
Scan the QR code when it appears to run the app on your mobile device, or type `a` or `i` to use a simulator.

When the app opens, an input box and search button will appear. Happy searching!
