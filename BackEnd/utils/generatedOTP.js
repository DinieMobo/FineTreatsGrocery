const generatedOTP = () => {
  return Math.floor(Math.random() * 900000) + 100000; /// 100000 - 999999
};

export default generatedOTP;