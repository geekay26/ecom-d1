import React from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-bold">${product.price}</p>
            <p className="text-sm text-gray-500">
              {product.inventory > 0
                ? `${product.inventory} in stock`
                : "Out of stock"}
            </p>
          </div>
          <div className="mt-4">
            <a
              href={`/product/${product.id}`}
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md 
                       hover:bg-blue-700 text-center"
            >
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
