import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getDocs, collection, query, where, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import html2pdf from 'html2pdf.js'; 

export default function DashProducts() {
  const [userProducts, setUserProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const currentUser = useSelector((state) => state.user.currentUser);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const reportRef = useRef(); 

  useEffect(() => {
    if (currentUser) {
      fetchUserProducts();
    }
    fetchCategories();
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, userProducts]);

  const fetchUserProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'UserPost'), where("userEmail", "==", currentUser.email));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id });
      });
      setUserProducts(products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user products: ", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Category'));
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push(doc.data().name);
      });
      setCategories(['All', ...categoriesData]);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const applyFilters = () => {
    let filtered = userProducts;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'UserPost', productId));
      setUserProducts(userProducts.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  
  const generateReport = () => {
    const element = reportRef.current;
    const options = {
      margin: 1,
      filename: 'product-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">My Shop Products</h1>

     
      <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-blue-700">
          Total Products: {userProducts.length}
        </h2>
      </div>

    
      <div className="mb-6 flex justify-between items-center">
        
        <div className="flex-1 mr-4">
          <label className="block mb-2 font-medium text-blue-700">Filter by Category:</label>
          <select
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

   
        <div className="flex-1">
          <label className="block mb-2 font-medium text-blue-700">Search by Name:</label>
          <input
            type="text"
            className="border border-blue-300 p-2 rounded-lg w-full text-blue-700"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

     
      <div className="mb-6 text-center">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
          onClick={generateReport}
        >
          Generate Report
        </button>
      </div>

    
      <div style={{ display: 'none' }}>
        <div ref={reportRef} className="report-content" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Product Report</h1>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Total Products: {userProducts.length}</h2>
          <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px', backgroundColor: '#f2f2f2' }}>Title</th>
                <th style={{ border: '1px solid black', padding: '10px', backgroundColor: '#f2f2f2' }}>Description</th>
                <th style={{ border: '1px solid black', padding: '10px', backgroundColor: '#f2f2f2' }}>Price</th>
                <th style={{ border: '1px solid black', padding: '10px', backgroundColor: '#f2f2f2' }}>Category</th>
              </tr>
            </thead>
            <tbody>
              {userProducts.map((product, index) => (
                <tr key={product.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{product.title}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{product.desc}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>Rs. {product.price}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Contact us: support@yourshop.com | +94 123 456 789</p>
          </footer>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-blue-700">{product.title}</h2>
              <p className="text-gray-500 mb-2">{product.desc}</p>
              <p className="text-gray-800 font-bold">Rs. {product.price}</p>
              <div className="flex justify-between mt-4">
                <button className="text-blue-500" onClick={() => handleEditProduct(product.id)}>Edit</button>
                <button className="text-red-500" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
