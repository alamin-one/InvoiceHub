const generateOtp = () => {
  const otp = Math.floor(Math.random() * 900000 + 100000).toString();
  const otpExpires = new Date(Date.now() + 1000 * 60 * 30);
  return {
    otp,
    otpExpires,
  };
};

module.exports = generateOtp;
