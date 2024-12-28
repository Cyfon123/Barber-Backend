const validateAppointment = (req, res, next) => {
    const { name, email, date, time, service } = req.body;
    
    if (!name || !email || !date || !time || !service) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    next();
  };
  
  module.exports = { validateAppointment };