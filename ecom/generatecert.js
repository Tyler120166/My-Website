// generateCert.js
const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Promisify readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

// Directory for SSL certificates
const sslDir = path.join(__dirname, 'ssl');

(async () => {
    // Custom certificate attributes
    const commonName = await question('Enter Common Name (default: localhost): ') || 'localhost';
    const country = await question('Enter Country (default: US): ') || 'US';
    const state = await question('Enter State (default: California): ') || 'California';
    const locality = await question('Enter Locality (default: San Francisco): ') || 'San Francisco';
    const organization = await question('Enter Organization (default: My Company): ') || 'My Company';
    const organizationalUnit = await question('Enter Organizational Unit (default: IT): ') || 'IT';

    rl.close();

    const attrs = [
        { name: 'commonName', value: commonName },
        { name: 'countryName', value: country },
        { shortName: 'ST', value: state },
        { shortName: 'L', value: locality },
        { shortName: 'O', value: organization },
        { shortName: 'OU', value: organizationalUnit }
    ];

    const options = {
        days: 365,
        keySize: 2048, // RSA key size
        algorithm: 'sha256', // Signature algorithm
        extensions: [
            {
                name: 'basicConstraints',
                cA: true
            },
            {
                name: 'keyUsage',
                keyCertSign: true,
                digitalSignature: true,
                keyEncipherment: true
            },
            {
                name: 'subjectAltName',
                altNames: [
                    {
                        type: 2, // DNS
                        value: commonName
                    }
                ]
            }
        ]
    };

    const pems = selfsigned.generate(attrs, options);

    // Ensure ssl directory exists
    if (!fs.existsSync(sslDir)) {
        fs.mkdirSync(sslDir, { recursive: true });
    }

    // Write the private key and certificate to files
    fs.writeFileSync(path.join(sslDir, 'server.key'), pems.private, { mode: 0o600 });
    fs.writeFileSync(path.join(sslDir, 'server.cert'), pems.cert, { mode: 0o644 });

    console.log('Self-signed certificates generated in ssl/ directory');

    // Enhanced logging
    console.log('--- Certificate Details ---');
    console.log(`Common Name: ${commonName}`);
    console.log(`Country: ${country}`);
    console.log(`State: ${state}`);
    console.log(`Locality: ${locality}`);
    console.log(`Organization: ${organization}`);
    console.log(`Organizational Unit: ${organizationalUnit}`);
    console.log(`Validity: 365 days`);
    console.log('----------------------------');

    // Additional security: verify the generated certificate
    const execSync = require('child_process').execSync;
    const certPath = path.join(sslDir, 'server.cert');
    try {
        const result = execSync(`openssl x509 -in ${certPath} -noout -text`);
        console.log(`\nCertificate verification:\n${result.toString()}`);
    } catch (error) {
        console.error('Error verifying the certificate:', error.message);
    }
})();
