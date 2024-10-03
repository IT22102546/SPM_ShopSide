import admin from 'firebase-admin';
import { errorHandler } from '../utils/error.js';

export const testStaff = async(req, res, next) =>{
    res.json({message:'Staff API is Working'});
};

export const createStaff = async (req, res, next) => {
  const db = admin.firestore();
  
  try {
      // Extract the form data from the request body
      const { brnumber, name, email, gender, phone, age } = req.body;

      // Basic validation for required fields
      if (!brnumber || !name || name.length < 3) {
          return next(errorHandler(400, 'Staff name must be at least 3 characters long and BR number is required.'));
      }

      if (!email || !gender || !phone || !age) {
          return next(errorHandler(400, 'Email, gender, phone, and age are required.'));
      }

      // Check if a staff record with the same email already exists under the same BR number
      const staffSnapshot = await db.collection('staff')
          .where('brnumber', '==', brnumber)
          .where('phone', '==', phone)
          .get();

      if (!staffSnapshot.empty) {
          return next(errorHandler(400, 'A staff member with this phone already exists for this shop.'));
      }

      // Create a new staff record
      const staffRef = db.collection('staff').doc(); // Generate a new document reference
      const newStaff = {
          id: staffRef.id,    // Auto-generated Firestore ID
          brnumber,           // Business number (for tracking by shop)
          name,
          email,
          gender,
          phone,
          age,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),  // Server timestamp for creation
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),  // Server timestamp for updates
      };

      // Save the new staff details to Firestore
      await staffRef.set(newStaff);
      console.log('New staff record created with ID:', staffRef.id);

      // Respond with success message and created staff details
      return res.status(201).json({ success: true, message: "Staff added successfully", staff: newStaff });
      
  } catch (error) {
      console.error('Error creating staff record:', error);
      return next(errorHandler(500, 'Internal Server Error'));
  }
};


export const getStaff = async (req, res, next) => {
  const db = admin.firestore();

  try {
      // Extract the brnumber from request query or params
      const { brnumber } = req.params;

      // Basic validation to check if brnumber is provided
      if (!brnumber) {
          return next(errorHandler(400, 'BR number is required to fetch staff.'));
      }

      // Query Firestore to get all staff associated with the provided brnumber
      const staffSnapshot = await db.collection('staff')
          .where('brnumber', '==', brnumber)
          .get();

      // If no staff members are found, return an appropriate message
      if (staffSnapshot.empty) {
          return res.status(404).json({ success: false, message: 'No staff members found for this BR number.' });
      }

      // Extract staff data from the snapshot
      const staffList = staffSnapshot.docs.map(doc => ({
          id: doc.id,  // Document ID
          ...doc.data()  // All staff details
      }));

      // Respond with the list of staff members
      return res.status(200).json({ success: true, staff: staffList });
      
  } catch (error) {
      console.error('Error fetching staff members:', error);
      return next(errorHandler(500, 'Internal Server Error'));
  }
};


export const assignStaff = async (req, res, next) => {
  const db = admin.firestore();

  try {
      // Extract parameters and job description from request
      const { staffPhone, brnumber } = req.params;
      const { jobDescription } = req.body;  // Job description passed in the body

      // Validate if the necessary parameters are provided
      if (!staffPhone || !brnumber || !jobDescription) {
          return res.status(400).json({ success: false, message: "Staff phone number, BR number, and job description are required." });
      }

      // Query Firestore to find the staff member by phone number and BR number
      const staffSnapshot = await db.collection('staff')
          .where('phone', '==', staffPhone)
          .where('brnumber', '==', brnumber)
          .get();

      // If no staff member is found, return a not found error
      if (staffSnapshot.empty) {
          return res.status(404).json({ success: false, message: "Staff member not found with the provided phone number in this store." });
      }

      // Loop through the found staff members (though there should typically be only one)
      staffSnapshot.forEach(async (doc) => {
          // Update the staff document with the job description
          await db.collection('staff').doc(doc.id).update({
              jobDescription: jobDescription,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),  // Update timestamp
          });

          console.log(`Job assigned to staff: ${doc.id}`);
      });

      // Respond with success after updating the staff record
      return res.status(200).json({ success: true, message: "Job description assigned successfully." });

  } catch (error) {
      console.error('Error assigning job to staff:', error);
      return next(errorHandler(500, 'Internal Server Error'));
  }
};

export const removeAssignedJob = async (req, res, next) => {
  const db = admin.firestore();

  try {
      // Extract parameters and job description from request
      const { staffPhone, brnumber } = req.params;
      const { jobDescription } = req.body;  // Job description passed in the body

      // Validate if the necessary parameters are provided
      if (!staffPhone || !brnumber ) {
          return res.status(400).json({ success: false, message: "Staff phone number, BR number are required." });
      }

      // Query Firestore to find the staff member by phone number and BR number
      const staffSnapshot = await db.collection('staff')
          .where('phone', '==', staffPhone)
          .where('brnumber', '==', brnumber)
          .get();

      // If no staff member is found, return a not found error
      if (staffSnapshot.empty) {
          return res.status(404).json({ success: false, message: "Staff member not found with the provided phone number in this store." });
      }

      // Loop through the found staff members (though there should typically be only one)
      staffSnapshot.forEach(async (doc) => {
          // Update the staff document with the job description
          await db.collection('staff').doc(doc.id).update({
              jobDescription: jobDescription,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),  // Update timestamp
          });

          console.log(`Job removed from assigned  staff: ${doc.id}`);
      });

      // Respond with success after updating the staff record
      return res.status(200).json({ success: true, message: "Job description updated successfully." });

  } catch (error) {
      console.error('Error removing job from staff:', error);
      return next(errorHandler(500, 'Internal Server Error'));
  }
};

export const updateStaff = async (req, res, next) => {
  const db = admin.firestore();

  try {
      // Extract parameters and updated data from the request
      const { staffPhone, brnumber } = req.params;
      const { name, email, gender, phone, age } = req.body; // Extract updated fields

      // Validate if at least one field is provided to update
      if (!name && !email && !gender && !phone && !age) {
          return res.status(400).json({ success: false, message: "At least one field is required to update." });
      }

      // Query Firestore to find the staff member by phone number and BR number
      const staffSnapshot = await db.collection('staff')
          .where('phone', '==', staffPhone)
          .where('brnumber', '==', brnumber)
          .get();

      // If no staff member is found, return a not found error
      if (staffSnapshot.empty) {
          return res.status(404).json({ success: false, message: "Staff member not found with the provided phone number and BR number." });
      }

      // Update staff member details
      staffSnapshot.forEach(async (doc) => {
          // Prepare the update object
          const updatedData = {
              ...(name && { name }),        // Update name if provided
              ...(email && { email }),      // Update email if provided
              ...(gender && { gender }),    // Update gender if provided
              ...(phone && { phone }),      // Update phone if provided
              ...(age && { age }),          // Update age if provided
              updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Update timestamp
          };

          // Update the staff document in Firestore
          await db.collection('staff').doc(doc.id).update(updatedData);

          console.log(`Staff profile updated: ${doc.id}`);
      });

      // Respond with success after updating the staff record
      return res.status(200).json({ success: true, message: "Staff profile updated successfully." });

  } catch (error) {
      console.error('Error updating staff profile:', error);
      return next(errorHandler(500, 'Internal Server Error'));
  }
};
