import postgres from 'postgres';

const connectDB = async()=>{
  try {
    const pg = postgres(process.env.DB_URL);
    return pg
  } catch (error) {
    console.log("Error when connecting to DB: ", error);
  }
}

const sql = await connectDB();

export default sql;