"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/axios/axiosInstance";
import axios from "axios";
import {
  ShoppingCart,
  Filter,
  X,
  Package,
  Phone,
  User,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  Home,
  Coffee,
  Utensils,
  Croissant,
  Shield, // Adding Shield icon for Admin link
  // Replacing Cup with Coffee
  Coffee as Beverage,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProductListingPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [formData, setFormData] = useState({
    name: "",
    hostel: "",
    phoneNumber: "",
    quantity: 1,
    productId: "",
  });

  // Admin modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/api/food");
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters, search, and sorting
    let result = [...products];

    // Category filter
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep default ordering
        break;
    }

    setFilteredProducts(result);
  }, [products, category, searchQuery, sortOption]);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({ ...prev, productId: product.id }));
    setIsModalOpen(true);
  };

  const handleFoodClick = (product) => {
    // This function replaces handleBuyNow for the new UI
    setSelectedProduct(product);
    setFormData((prev) => ({ ...prev, productId: product.id }));
    setIsModalOpen(true);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (change) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/orders", formData);
      setFormData({
        name: "",
        hostel: "",
        phoneNumber: "",
        quantity: 1,
        productId: "",
      });
      setIsModalOpen(false);
      setTimeout(
        showNotification(
          "Order placed successfully..You'll be contacted shortly!",
          "success"
        ),
        3000
      );
    } catch {
      showNotification("Failed to place order. Please try again.", "error");
    }
  };

  // Handle admin modal input changes
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      // Validate admin credentials against environment variables
      const response = await axios.post("/api/admin/verify", adminCredentials);

      if (response.data.success) {
        // Reset form and close modal
        setAdminCredentials({ username: "", password: "" });
        setIsAdminModalOpen(false);

        // Navigate to admin page
        router.push("/admin");
      } else {
        setAuthError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setAuthError("Authentication failed. Please try again.");
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white px-4 py-3 rounded shadow-lg fixed top-4 right-4 z-50 flex items-center`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="ml-4">×</button>
    `;
    document.body.appendChild(notification);

    notification.querySelector("button").addEventListener("click", () => {
      document.body.removeChild(notification);
    });

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  };

  // Function to get optimized Cloudinary image URL
  const getCloudinaryUrl = (imageUrl, width = 400, height = 300) => {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return imageUrl;

    // Extract the base URL and public ID from the Cloudinary URL
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length !== 2) return imageUrl;

    // Add transformation parameters
    return `${urlParts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${urlParts[1]}`;
  };

  // Get the right icon for each category
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Local Dishes":
        return <Utensils size={16} />;
      case "Breakfast Meals":
        return <Coffee size={16} />;
      case "Snacks & Pastries":
        return <Croissant size={16} />;
      case "Beverages":
        return <Beverage size={16} />;
      default:
        return <Home size={16} />;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-[#493711] shadow-sm sticky top-0 z-10 text-white p-4">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/">
            <h1 className="text-2xl hidden font-bold md:flex items-center hover:scale-105 cursor-pointer transition-all">
              FoodDelivery
            </h1>
          </Link>
          <div className="relative w-full max-w-md mx-4">
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute text-black left-3 top-1/2 transform -translate-y-1/2"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <button
              className="hover:text-blue-600 flex items-center"
              onClick={() => setIsAdminModalOpen(true)}
            >
              <Shield size={24} />
              <span className="ml-1 hidden md:inline">Admin</span>
            </button>
            <button className="hover:text-blue-600">
              <User size={24} />
            </button>
            <button className="hover:text-blue-600 relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex gap-2 flex-wrap">
            {[
              "all",
              "Local Dishes",
              "Breakfast Meals",
              "Snacks & Pastries",
              "Beverages",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors hover:cursor-pointer ${
                  category === cat
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat === "all" ? <Home size={16} /> : getCategoryIcon(cat)}
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <label className="text-gray-600 mr-2">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-6">
              We couldn't find any meals matching your criteria.
            </p>
            <button
              onClick={() => {
                setCategory("all");
                setSearchQuery("");
                setSortOption("default");
              }}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all hover:scale-105"
                onClick={() => handleFoodClick(product)}
              >
                <img
                  src={getCloudinaryUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-food.jpg"; // Fallback image
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-[#493711]">{product.name}</h3>
                  <p className="text-sm text-[#FBB60E] mt-2">
                    From ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Order Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Complete Your Order
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center mb-4 pb-4 border-b">
                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 mr-4">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={getCloudinaryUrl(selectedProduct.imageUrl, 200, 200)}
                      alt={selectedProduct.name}
                      className="w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-food.jpg"; // Fallback image
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-800 text-xl font-bold">
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="hidden"
                  name="productId"
                  value={selectedProduct.id}
                />
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    <User size={16} className="inline mr-1" /> Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    <Home size={16} className="inline mr-1" /> Hostel/Address
                  </label>
                  <input
                    name="hostel"
                    type="text"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your hostel or delivery address"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    <Phone size={16} className="inline mr-1" /> Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                    >
                      <ChevronDown size={20} />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                      {formData.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                    >
                      <ChevronUp size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ${(selectedProduct.price * formData.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">${(5.0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-gray-800">
                      $
                      {(
                        selectedProduct.price * formData.quantity +
                        5.0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors mt-4"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
              <button
                onClick={() => {
                  setIsAdminModalOpen(false);
                  setAdminCredentials({ username: "", password: "" });
                  setAuthError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-5">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                {authError && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{authError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    <User size={16} className="inline mr-1" /> Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    value={adminCredentials.username}
                    onChange={handleAdminInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin username"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={adminCredentials.password}
                    onChange={handleAdminInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors mt-4"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#493711] ">
        <p className="text-white py-8 text-base text-center font-semibold">
          Copyright &copy; {new Date().getFullYear()} FoodDelivery.
        </p>
      </footer>
    </div>
  );
};

export default ProductListingPage;
