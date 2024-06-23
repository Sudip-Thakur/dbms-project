import jwt from 'jsonwebtoken';

const generateAccessToken = function(user){
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
    return token;
  } catch (error) {
    console.log("Generating token error: ", error);
    throw error;
  }
}

const generateRefreshToken = function(user){
  try {
    const token = jwt.sign(
      {
        id : user.id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    );
    return token;
  }catch(error){
    console.log("Generating token error: ", error);
    throw error;
  }
}

const validateToken = function(){
  try {
    const decode = jwt.verify(token,secret)
  } catch (error) {
    throw error;
  }
}
export {generateAccessToken, generateRefreshToken, validateToken};  // export the functions