import admin from 'firebase-admin';
import { errorHandler } from '../utils/error.js'; 
import jwt from 'jsonwebtoken'; 

export const signup = async (req, res, next) => {
  const { shopname, brnumber, password, email } = req.body;

  // Validation regexes
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
  const brnumberRegex = /^[0-9]{8}$/;  

  if (!shopname || !brnumber || !password || !email) {
    return next(errorHandler(400, 'Please fill in all fields.'));
  } else if (!brnumberRegex.test(brnumber)) {
    return next(errorHandler(400, 'Invalid Business Registration Number format.'));
  } else if (!passwordRegex.test(password)) {
    return next(errorHandler(400, 'Password must be at least 5 characters long with one uppercase letter, one digit, and one symbol.'));
  }

  try {
    const shopnameSnapshot = await admin.firestore()
      .collection('users')
      .where('shopname', '==', shopname)
      .get();

    if (!shopnameSnapshot.empty) {
      return next(errorHandler(400, 'Shop name already exists. Please choose a different one.'));
    }

    const brnumberSnapshot = await admin.firestore()
      .collection('users')
      .where('brnumber', '==', brnumber)
      .get();

    if (!brnumberSnapshot.empty) {
      return next(errorHandler(400, 'Business Registration Number already exists.'));
    }

    const existingUser = await admin.auth().getUserByEmail(email).catch(err => null);
    if (existingUser) {
      return next(errorHandler(400, 'Email already exists. Please use a different email.'));
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const userRef = admin.firestore().collection('users').doc(userRecord.uid);
    await userRef.set({
      shopname,
      brnumber,
      email,
      password,
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


export const signin = async (req, res, next) => {
    const { brnumber, password } = req.body;

    if (!brnumber || !password) {
        return next(errorHandler(400, 'Please provide both Business Registration Number and password.'));
    }

    try {
        // Query Firestore to find the user by Business Registration Number (brnumber)
        const brnumberSnapshot = await admin.firestore()
            .collection('users')
            .where('brnumber', '==', brnumber)
            .get();

        if (brnumberSnapshot.empty) {
            console.log('User not found with BR Number:', brnumber); // Debugging log
            return next(errorHandler(404, 'User with the provided Business Registration Number not found.'));
        }

        // Get the user document (assuming brnumber is unique, so we take the first match)
        const userDoc = brnumberSnapshot.docs[0];
        const userData = userDoc.data();

        // Compare passwords (consider using hashed passwords in production)
        if (password !== userData.password) {
            console.log('Password mismatch for BR Number:', brnumber); // Debugging log
            return next(errorHandler(401, 'Invalid credentials.'));
        }

        // Create a token
        const token = jwt.sign(
            { uid: userDoc.id, email: userData.email }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiration
        );

        // Set token in cookies
        res.cookie('access_token', token, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 3600000 // 1 hour
        });

        // Send the response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                email: userData.email,
                shopname: userData.shopname,
                brnumber: userData.brnumber,
                createdAt: userData.createdAt,
            },
        });

    } catch (error) {
        console.error('Sign-in error:', error); // Debugging log
        return next(errorHandler(500, error.message || 'Internal Server Error'));
    }
};

