const axios = require('axios');

const sendVerifiedEmail = async (code, email) => {
  const res = await axios.post(
    `${process.env.FRONTEND_URL}/api/send-email`,
    { code, email },
    {
      headers: {
        'x-internal-secret': process.env.INTERNAL_API_SECRET,
      },
    },
  );
  return res.data;
};

module.exports = sendVerifiedEmail;
