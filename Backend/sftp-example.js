const Client = require('ssh2-sftp-client');
const sftp = new Client();
const fs = require("fs")

const config = {
  host: '52.65.123.64',
  port: 22,
  username: 'IsoftTechnologies',
  password: 'Pa4@xV0^6EUiMW#3nt@Z',
  // OR use privateKey authentication:
  // privateKey: require('fs').readFileSync('/path/to/private/key')
};

async function main() {
  try {
    await sftp.connect(config);

    console.log('✅ Connected to SFTP server');

    const fileList = await sftp.list('/');
    console.log('📁 Remote files:', fileList);

    // Example: upload a file
    // await sftp.fastPut('./local-file.txt', '/remote/path/remote-file.txt');
    // console.log('⬆️ File uploaded successfully');

    // // Example: download a file
    await sftp.fastGet('/EXOStockItems.csv', 'downloaded.csv');
    const data = fs.readFileSync("./downloaded.csv", (err, data)=>{
    console.log(data)
})
    console.log(data)
    console.log('⬇️ File downloaded successfully');
  } catch (err) {
    console.error('❌ SFTP error:', err.message);
  } finally {
    await sftp.end();
    console.log('🔒 Connection closed');
  }
}

main();
