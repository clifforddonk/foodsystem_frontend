"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import Link from "next/link";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [foodItems, setFoodItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Delivery fee constant
  const DELIVERY_FEE = 10.0;

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/orders");
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch food item details
  const fetchFoodItem = async (productId) => {
    try {
      const response = await axiosInstance.get(`/api/food/${productId}`);
      setFoodItems((prev) => ({
        ...prev,
        [productId]: response.data,
      }));
    } catch (err) {
      console.error("Error fetching food item:", err);
    }
  };

  // Function to delete an order
  const deleteOrder = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      try {
        await axiosInstance.delete(`/api/orders/${orderId}`);
        // Remove order from local state
        setOrders(orders.filter((order) => order.id !== orderId));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
          setShowModal(false);
        }
        alert("Order deleted successfully");
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order. Please try again.");
      }
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    return (
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.hostel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle order click to show modal
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    // Fetch food item details if not already cached
    if (order.productId && !foodItems[order.productId]) {
      fetchFoodItem(order.productId);
    }
    setShowModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total with delivery fee
  const calculateTotal = (order) => {
    if (!foodItems[order.productId]) return "Calculating...";

    const subtotal = order.quantity * foodItems[order.productId].price;
    const total = subtotal + DELIVERY_FEE;

    return `₵${total.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#493711] text-white p-8 shadow-md">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Orders Dashboard</h1>
          <h1 className="text-3xl font-bold">
            <Link href="/">HomePage</Link>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Orders Management
            </h2>
            <button
              onClick={fetchOrders}
              className="bg-[#493711] hover:bg-[#493711d8] cursor-pointer text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Refresh Orders
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by order ID, customer name or hostel..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Error message */}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Loading indicator */}
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hostel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {order.hostel}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer mr-3"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointers"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Order Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Customer Information
                    </h4>
                    <p className="mt-1">Name: {selectedOrder.name}</p>
                    <p>Hostel: {selectedOrder.hostel}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Order Information
                    </h4>
                    <p className="mt-1">Quantity: {selectedOrder.quantity}</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-700 mb-2">
                  Food Details
                </h4>
                {foodItems[selectedOrder.productId] ? (
                  <div className="flex items-center bg-gray-50 p-4 rounded-md mb-4">
                    <div className="w-20 h-20 mr-4">
                      <img
                        src={foodItems[selectedOrder.productId].imageUrl}
                        alt={foodItems[selectedOrder.productId].name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        {foodItems[selectedOrder.productId].name}
                      </p>
                      <p>
                        Category: {foodItems[selectedOrder.productId].category}
                      </p>
                      <p>
                        Price: ₵
                        {foodItems[selectedOrder.productId].price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center bg-gray-50 p-4 rounded-md mb-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                    <p>Loading food details...</p>
                  </div>
                )}

                <h4 className="font-semibold text-gray-700 mb-2">
                  Order Summary
                </h4>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {foodItems[selectedOrder.productId] && (
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {foodItems[selectedOrder.productId].name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                          {selectedOrder.quantity}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          ₵{foodItems[selectedOrder.productId].price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          ₵
                          {(
                            selectedOrder.quantity *
                            foodItems[selectedOrder.productId].price
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                      >
                        Delivery Fee:
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ₵{DELIVERY_FEE.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="3"
                        className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-right"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {foodItems[selectedOrder.productId]
                          ? calculateTotal(selectedOrder)
                          : "Calculating..."}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => deleteOrder(selectedOrder.id)}
                    className="bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-700"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
