const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'zaq12wsx';
    const saltRounds = 8;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // 验证
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification:', isValid);
}

generateHash();
