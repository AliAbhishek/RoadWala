const Response = {
  success: (res, status, message, data) => {
    return res.status(status).json({ success: true, status, message, data });
  },
  error: (res, status, message) => {
    return res.status(status).json({ success: false, status, message });
  },
};

export default Response;
