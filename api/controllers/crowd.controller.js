import admin from 'firebase-admin';
import { errorHandler } from '../utils/error.js';


export const testCrowd = async(req, res, next) =>{
    res.json({message:'Crowd count API is Working'});
};

export const createRecord = async (req, res, next) => {
    const db = admin.firestore();
    
    try {
        // Extract necessary data from the request
        const { shopname, brnumber, email, crowdCount } = req.body;

        // Basic validation
        if (!shopname || shopname.length < 3) {
            return next(errorHandler(400, 'Shop name must be at least 3 characters long.'));
        }

        if (!crowdCount && crowdCount !== 0) {
            return next(errorHandler(400, 'Crowd count is required.'));
        }

        // Check if a record for the shop already exists
        const shopSnapshot = await db.collection('crowdcount')
            .where('brnumber', '==', brnumber)
            .get();

        if (!shopSnapshot.empty) {
            return next(errorHandler(400, 'A record for this shop already exists.'));
        }

        // Create a new record
        const newRecord = {
            shopname,
            brnumber,
            email: email || '',
            crowdCount: crowdCount || 0,  // Initialize with 0 if no crowd count is provided
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Add the record to Firestore
        const docRef = await db.collection('crowdcount').add(newRecord);
        console.log('New shop record created with ID:', docRef.id);

        // Send the created record back to the client
        res.status(201).json({ success: true, recordId: docRef.id, record: newRecord });
    } catch (error) {
        console.error('Error creating new record:', error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};


export const getCrowdCountMicroservice = async (req, res, next) => {
    try {
        // Make a request to the Python microservice to get the device count
        const response = await fetch('http://127.0.0.1:5000/device-count');
        
        // Check if the response is ok (status code 2xx)
        if (!response.ok) {
            throw new Error('Failed to fetch the crowd count from the microservice');
        }

        // Parse the response JSON
        const data = await response.json();
        const crowdCount = data.device_count;  // Ensure this matches the key from the Python API
        
        // Save to Firebase (if needed can uncomment this code below)
        // await admin.database().ref('/crowdCount').set(crowdCount);
        
        // Send the crowd count back to the client
        res.json({ crowdCount });
        
        // Log the crowd count to the console (for debugging purposes)
        console.log('Crowd count from microservice:', crowdCount);
    } catch (error) {
        // Log the error and send a 500 status response with an error message
        console.error('Error fetching crowd count:', error);
        res.status(500).json({ error: 'Failed to get crowd count' });
    }
};


export const updateCrowdCount = async (req, res, next) => {
    const db = admin.firestore();
    const brnumber = req.params.brnumber;  // Assuming BR number is passed as a URL parameter

    // Validate that the brnumber is present
    if (!brnumber) {
        return next(errorHandler(400, 'Business Registration (BR) Number is required.'));
    }

    console.log('BR Number:', brnumber);  // Debugging line

    try {
        // Fetch the crowd document based on the BR number
        const crowdSnapshot = await db.collection('crowdcount')
            .where('brnumber', '==', brnumber)
            .get();
        
        if (crowdSnapshot.empty) {
            return next(errorHandler(404, 'Record with the provided BR Number not found.'));
        }

        const crowdDoc = crowdSnapshot.docs[0]; // Get the document
        const crowdData = crowdDoc.data();
        console.log(crowdData);

        // Get new crowd count from the request body
        const { crowdCount: newCrowdCount } = req.body; // This directly gets crowdCount from request body
        const updateData = {};

        // Update the crowd count if provided and it's different from the current one
        if (typeof newCrowdCount === 'number' && newCrowdCount !== crowdData.crowdCount) {
            // Ensure the new crowd count doesn't already exist for another record
            const existingCrowdSnapshot = await db.collection('crowdcount')
                .where('crowdCount', '==', newCrowdCount)
                .get();

            if (!existingCrowdSnapshot.empty) {
                return next(errorHandler(400, 'The new Crowd Count already exists for another record.'));
            }

            // Update the crowd count
            updateData.crowdCount = newCrowdCount;
        } else if (newCrowdCount === crowdData.crowdCount) {
            return next(errorHandler(400, 'New Crowd Count is the same as the current count.'));
        }

        // Apply updates to Firestore if there are changes
        if (Object.keys(updateData).length > 0) {
            await crowdDoc.ref.update(updateData);
            console.log('Updated Firestore crowd data:', updateData);
        } else {
            return next(errorHandler(400, 'No valid updates were provided.'));
        }

        // Fetch the updated crowd document from Firestore
        const updatedCrowdDoc = await crowdDoc.ref.get();
        const updatedCrowd = updatedCrowdDoc.data();

        // Send the updated data in the response
        res.status(200).json({ success: true, crowd: updatedCrowd });
    } catch (error) {
        console.error('Error updating crowd count:', error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const getCountfromDB = async (req, res, next) => {
    const db = admin.firestore();
    const brnumber = req.params.brnumber;  // Assuming the BR number is passed as a URL parameter

    // Validate that the brnumber is present
    if (!brnumber) {
        return next(errorHandler(400, 'Business Registration (BR) Number is required.'));
    }

    try {
        // Query the database for a record matching the brnumber
        const crowdSnapshot = await db.collection('crowdcount')
            .where('brnumber', '==', brnumber)
            .get();

        // Check if the record exists
        if (crowdSnapshot.empty) {
            return next(errorHandler(404, 'Record with the provided BR Number not found.'));
        }

        // Extract the document containing the crowd count
        const crowdDoc = crowdSnapshot.docs[0];  // Assume there's only one document per BR number
        const crowdData = crowdDoc.data();  // Get the data from the document

        // Return the crowd count
        res.status(200).json({
            success: true,
            crowdCount: crowdData.crowdCount
        });
    } catch (error) {
        console.error('Error fetching crowd count from the database:', error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};





// Endpoint to get crowd count from the Python microservice
// app.get('/get-crowd-count', async (req, res) => {
//     try {
//         const response = await fetch('http://127.0.0.1:5000/device-count');

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         const crowdCount = data.device_count; // Make sure to match the key returned by your Flask API

//         // Save to Firebase
//         // await admin.database().ref('/crowdCount').set(crowdCount);
//         res.json({ crowdCount });
//         console.log(crowdCount);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to get crowd count' });
//     }
// });