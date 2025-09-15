
const axios = require("axios");

const  verifyCaptcha = async(token)=> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;



    if(!secretKey){
        throw customError("Recaptcha secret key not found", 404)
    }

    const url = process.env.RECAPTCHA_VERIFICATION_URL;

    const response = await axios.post(
      url,
      {},
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    console.log("captcha response: ", response.data);

    return response.data;
  }

module.exports = {verifyCaptcha}