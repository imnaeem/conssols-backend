import jwt from "jsonwebtoken";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, secret);

      req.authenticationId = decodedData?.id;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default auth;
