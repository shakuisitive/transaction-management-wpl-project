const { migrate } = require('drizzle-orm/neon-serverless/migrator');
const { db } = require('../src/lib/db');

async function main() {
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 