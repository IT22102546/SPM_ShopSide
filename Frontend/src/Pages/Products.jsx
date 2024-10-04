import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase'; // Assuming firebase is initialized in this file

export default function ProductPage() {
  const location = useLocation();
  const { category } = queryString.parse(location.search);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const categories = ['All', 'Foods', 'ReadingTable', 'Beds', 'Fans'];

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [currentPage, searchTerm, selectedCategory, selectedPriceRange, user]);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      let q = query(productsRef, where('userId', '==', user.id)); // Fetch products added by current user

      if (selectedCategory) {
        q = query(q, where('category', '==', selectedCategory));
      }

      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setProducts(productsList);
      setTotalProducts(productsList.length); // Adjust total products count based on the query
      setTotalPages(Math.ceil(productsList.length / 10)); // Example pagination
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchProducts(); // Refresh products after deletion
      showNotification('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdate = (productId) => {
    // Redirect to update form, or show inline editing based on your preference
    console.log('Redirect to update page for product ID:', productId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat === 'All' ? '' : cat); // Clear category for 'All'
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id }));
      showNotification('Product added to the cart');
    } else {
      console.log('User not logged in');
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">
          Explore your products at Hostel Management Application
        </h2>
      </div>

      <div className="flex">
        {/* Sidebar for filters */}
        <aside className="w-1/4 p-4 border-r">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Categories</h4>
            <ul>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`text-left block w-full px-2 py-1 mb-1 rounded ${
                      selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Price Range Filter */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Price Range</h4>
            <ul>
              {['All', '0-1000', '1000-5000', '5000+'].map((range) => (
                <li key={range}>
                  <button
                    className={`text-left block w-full px-2 py-1 mb-1 rounded ${
                      selectedPriceRange === range ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => handlePriceRangeChange(range)}
                  >
                    {range}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="w-3/4 p-4">
          <div className="mb-4 w-52">
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full px-4 py-2 border rounded"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg shadow-lg p-4">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-40 object-cover mb-4"
                  />
                </Link>
                <h3 className="text-lg font-semibold text-center mb-2">
                  <Link to={`/product/${product.slug}`}>{product.title}</Link>
                </h3>
                <p className="text-center text-blue-800 font-semibold">{product.description}</p>
                <p className="text-center text-gray-600">Price: Rs. {product.price}</p>

                <div className="flex justify-center mt-4 space-x-2">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Buy Now
                  </button>
                  <button
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => handleUpdate(product.id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-2 px-4 py-2 bg-indigo-200 hover:bg-indigo-300 rounded"
            >
              Previous
            </button>
            <span className="mx-2 px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-2 px-4 py-2 bg-indigo-200 hover:bg-indigo-300 rounded"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {/* Notification */}
      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded">
          {notification.message}
        </div>
      )}
    </div>
  );
}
