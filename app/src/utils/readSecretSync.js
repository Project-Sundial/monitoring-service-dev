import fs from 'fs';

const readSecretSync = () => {
  try {
    const password = fs.readFileSync(process.env.POSTGRES_PASSWORD_FILE, 'utf8');
    return password.trim();
  } catch (error) {
    console.error('Error reading secret:', error);
    throw error;
  }
};

export default readSecretSync;
