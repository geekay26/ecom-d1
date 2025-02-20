import React from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex justify-between items-center mb-6">
          <p className="text-3xl font-bold">${product.price}</p>
          <p className="text-gray-600">
            {product.inventory > 0
              ? `${product.inventory} in stock`
              : "Out of stock"}
          </p>
        </div>

        <button
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md 
                   hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={product.inventory === 0}
        >
          {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
