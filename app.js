// Sha3 is a module to hash documents
const { SHA3 } = require("sha3");
const hash = new SHA3(256);
const fs = require("fs");

const fileName = "./blochain.json";

// We start our nonce at 0
let nonce = 0;
// Difficulty of the Blockchain. The more you add 0, the more it will be difficut to mine a Block
const difficulty = "000";
// Switch to end the while loop
let notFounded = true;

// Function used to update our Blockhcain
const updateBlockchain = (id, timestamp, nonce) => {
  let blockchain = require(fileName);
  // We create the new Block
  const addBlock = {
    id: id,
    timestamp: timestamp,
    nonce: nonce
  };
  // We add it into the Blockchain
  blockchain.push(addBlock);
  fs.writeFile(
    fileName,
    JSON.stringify(blockchain, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
};

// Function to mine a Block
const mining = () => {
  var start = new Date().getTime();
  // We import the Blockchain
  const blockchain = require(fileName);

  while (notFounded) {
    // We need to reset our hash every loop
    hash.reset();
    // We hash the new data (block + nonce)
    hash.update(JSON.stringify(blockchain) + nonce);
    let hashed = hash.digest("hex");
    // IF the new hashed data starts with '000'
    if (hashed.startsWith(difficulty)) {
      var diff = (new Date().getTime() - start) / 1000;
      // We turn the switch off to end the while loop
      notFounded = false;
      console.log("\x1b[46m%s\x1b[0m", "//// FOUNDED ! ////");
      console.log(`Hash : ${hashed}`);
      console.log(`Nonce : ${nonce}`);
      console.log(`Total time : ${diff}s`);
      console.log("\x1b[46m%s\x1b[0m", "////           ////");
      // We execute the updateBlockchain
      updateBlockchain(hashed, Date.now(), nonce);
    } else {
      // PLEASE NOTE: If you want your mining process to be faster, delete or comment the next console.log()
      console.log(hashed);
      // We increment the nonce and start again the loop
      nonce++;
    }
  }
};

// When we launch the app, start mining
mining();
