import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import QRCode from 'react-qr-code';

export default function EditProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const navigate = useNavigate();
  const qrRef = useRef(); // Use a ref to hold the QR code component

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const productRef = doc(db, 'UserPost', productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data();
        setProduct(productData);
        setUpdatedData(productData);
        setLoading(false);
      } else {
        console.error('Product does not exist');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, 'Category');
      const categorySnap = await getDocs(categoriesRef);
      const categoryList = categorySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let imageUrl = updatedData.image; // Default to current image

    if (imageFile) {
      // Upload new image if a file is provided
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef); // Get the URL of the uploaded image
    }

    try {
      const productRef = doc(db, 'UserPost', productId);
      await updateDoc(productRef, { ...updatedData, image: imageUrl });
      alert('Product updated successfully!');
      navigate('/dashboard?tab=products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Set the selected image file
    }
  };

  const downloadQRCode = () => {
    // Access the QR Code canvas directly
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas'); // Access the canvas from the QRCode
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = 'qr_code.png'; // Name for the downloaded file
        link.click(); // Trigger the download
      } else {
        console.error('Canvas is not defined');
      }
    }
  };

  if (loading) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Edit Product</h1>
      <form onSubmit={handleUpdate}>
     
        <div className="mb-4">
          <label className="block font-medium text-blue-700">Title:</label>
          <input
            type="text"
            name="title"
            value={updatedData.title || ''}
            onChange={handleInputChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-blue-700">Description:</label>
          <textarea
            name="desc"
            value={updatedData.desc || ''}
            onChange={handleInputChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-blue-700">Price:</label>
          <input
            type="number"
            name="price"
            value={updatedData.price || ''}
            onChange={handleInputChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-blue-700">Size:</label>
          <input
            type="text"
            name="size"
            value={updatedData.size || ''}
            onChange={handleInputChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-blue-700">Cell Number:</label>
          <input
            type="text"
            name="cell"
            value={updatedData.cell || ''}
            onChange={handleInputChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            required
          />
        </div>


        <div className="mb-4">
          <label className="block font-medium text-blue-700">Category:</label>
          <select
            name="category"
            value={updatedData.category || ''}
            onChange={handleInputChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-blue-700">Upload New Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>

     
      {product && product.image && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-blue-700">Current Image:</h2>
          <img src={product.image} alt="Current Product" className="w-full h-48 object-cover rounded-lg mt-2" />
        </div>
      )}

      {/* Display the QR code */}
      {product && (
        <div className="mt-4" ref={qrRef}>
          <h2 className="text-lg font-semibold text-blue-700">Product QR Code:</h2>
          <QRCode
            value={JSON.stringify(updatedData)} 
            size={256}
            renderAs="canvas" 
          />
          
        </div>
      )}
    </div>
  );
}
