"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const ShoppingLandingPage = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  // Product data
  const products = [
    {
      id: 1,
      image: "/num b.jpg",
      category: "Women",
      title: "Ladies Dress",
      price: 250,
    },
    {
      id: 2,
      image: "/num c.jpg",
      category: "Women",
      title: "Two Piece Set",
      price: 180,
    },
    {
      id: 3,
      image: "/num 8.jpg",
      category: "Men",
      title: "Summer Shirt",
      price: 70,
    },
    {
      id: 4,
      image: "/num e.jpg",
      category: "Men",
      title: "Men Official Suit",
      price: 250,
    },
    {
      id: 5,
      image: "/num h.jpg",
      category: "Women",
      title: "Charm Bracelet",
      price: 50,
    },
    { id: 6, image: "/pic 11.jpg", category: "Men", title: "Watch", price: 80 },
    {
      id: 7,
      image: "/pic 8.jpg",
      category: "Women",
      title: "Heels",
      price: 100,
    },
    {
      id: 8,
      image: "/pic 9.jpg",
      category: "Men",
      title: "Sneakers",
      price: 150,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Luxloom Couture</h1>

        {/* Menu */}
        <div
          className={`absolute top-16 left-0 w-full bg-white md:static md:w-auto md:flex items-center md:space-x-8 shadow-md md:shadow-none p-4 md:p-0 transition-all ${
            menuActive ? "flex flex-col" : "hidden md:flex"
          }`}
        >
          <Link href="/" className="text-red-500 font-semibold">
            Home
          </Link>
          <Link href="/shop" className="text-gray-700 hover:text-red-500">
            Shop
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="content py-20 px-6 bg-gradient-to-r from-pink-50 to-purple-50 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          New Arrivals For Men & Women
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get The Best Women Fashion Arrivals
        </p>
        <Link href="/shop">
          <button className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Latest Products
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title.toLowerCase()}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mt-4">
                    <h2 className="text-lg font-bold text-gray-800">
                      {product.title}
                    </h2>
                    <span className="font-bold text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center text-white">
        <p>
          Copyrights at{" "}
          <a href="#" className="text-red-400 hover:text-red-300">
            Luxloom Couture
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ShoppingLandingPage;
