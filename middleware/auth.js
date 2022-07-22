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
    res
      .status(401)
      .json({ message: "Sorry! You are not authorized to access this page" });
  }
};

export default auth;
