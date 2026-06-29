const jwt = require("jsonwebtoken");

function authSocket(socket, next) {
  try {
    console.log("========== SOCKET AUTH ==========");
    console.log("Handshake Auth:", socket.handshake.auth);

    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token received");
      return next(new Error("Unauthorized: missing token"));
    }

    console.log("✅ Token received");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    if (!decoded.id) {
      console.log("❌ Invalid token payload");
      return next(new Error("Unauthorized: invalid token"));
    }

    socket.user = {
      _id: decoded.id,
    };

    console.log("✅ Socket authenticated");
    console.log("===============================");

    next();
  } catch (err) {
    console.log("❌ JWT Error:", err.message);
    next(new Error("Unauthorized: token failed"));
  }
}

module.exports = { authSocket };