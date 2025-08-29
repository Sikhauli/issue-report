require('dotenv').config();
const App = require('./src/main') 
const appInstance = new App();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

(async () => {
  await appInstance.connectToDatabase(MONGO_URI);
  appInstance.start(PORT);
})();
