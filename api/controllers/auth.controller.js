import admin from 'firebase-admin';
import { errorHandler } from '../utils/error.js';  

export const signup = async (req, res, next) => {
  const { shopname, brnumber, password } = req.body;

  // Validation regexes
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
  const brnumberRegex = /^[0-9]{8}$/;  // Assuming BR number has 8 digits, adjust as necessary

  if (!shopname || !brnumber || !password) {
    return next(errorHandler(400, 'Please fill in all fields.'));
  } else if (!brnumberRegex.test(brnumber)) {
    return next(errorHandler(400, 'Invalid Business Registration Number format.'));
  } else if (!passwordRegex.test(password)) {
    return next(errorHandler(400, 'Password must be at least 5 characters long with one uppercase letter, one digit, and one symbol.'));
  }

  try {
    
    const userRecord = await admin.auth().createUser({
      email: `${brnumber}@company.com`, 
      password,
    });

  
    const userRef = admin.firestore().collection('users').doc(userRecord.uid);
    await userRef.set({
      shopname,
      brnumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    
    console.error(error);
    return next(errorHandler(500, error.message || 'Internal Server Error'));
  }
};
