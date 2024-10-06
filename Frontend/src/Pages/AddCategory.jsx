import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

export default function AddCategory() {
    const [file, setFile] = useState({ image: null });
    const [uploadProgress, setUploadProgress] = useState({ image: null });
    const [uploadError, setUploadError] = useState({ image: null });
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const db = getFirestore(app); // Initialize Firestore

    const handleFileChange = (file, type) => {
      setFile({ ...file, [type]: file });
    };
  
    const handleUploadFile = (file, type) => {
      if (!file) {
        setUploadError({ ...uploadError, [type]: `Please select an ${type} file` });
        return;
      }
      setUploadError({ ...uploadError, [type]: null });
  
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({ ...uploadProgress, [type]: progress.toFixed(0) });
        },
        (error) => {
          setUploadError({ ...uploadError, [type]: `${type} upload failed` });
          setUploadProgress({ ...uploadProgress, [type]: null });
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadProgress({ ...uploadProgress, [type]: null });
            setUploadError({ ...uploadError, [type]: null });
            setFormData({ ...formData, [type]: downloadURL });
          });
        }
      );
    };
  
    // Function to handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        
        await addDoc(collection(db, "Category"), {
          name: formData.name,
          icon: formData.image, 
          createdAt: new Date(),
        });
  
        setPublishError(null);
        navigate(`/dashboard?tab=profile`);
      } catch (error) {
        setPublishError('Something went wrong');
        console.error(error);
      }
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Category name" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name:
            </label>
            <TextInput type='text' placeholder='Category name' required id='name' className='flex-1' onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            } />
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput type='file' accept='image/*' onChange={(e) => handleFileChange(e.target.files[0], 'image')} />
            <Button onClick={() => handleUploadFile(file.image, 'image')} type='button' size='sm' outline disabled={uploadProgress.image} className="bg-slate-400">
              {uploadProgress.image ? (
                <div className="w-16 h-16">
                  <CircularProgressbar value={uploadProgress.image} text={`${uploadProgress.image || 0}`} />
                </div>
              ) : ('Upload Image')}
            </Button>
          </div>
  
          {uploadError.image && <Alert color='failure'>{uploadError.image}</Alert>}
          {formData.image && <img src={formData.image} alt="upload" className="w-full h-82 object-cover" />}
  
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 mt-16"
          >
            Add Category
          </button>
        </form>
      </div>
    );
  }
