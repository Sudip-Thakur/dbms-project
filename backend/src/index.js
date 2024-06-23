import sql from './db/db.js'
import { app } from './app.js'
import dotenv from 'dotenv'

dotenv.config({
  path:'./env'
});

(async () => {
  try {
    // Test the database connection
    await sql`SELECT 1`;
    console.log('Database connection established');
    app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
  });
  } catch (err) {
    console.error('Could not connect to the database:', err);
    process.exit(1);
  }
})();
