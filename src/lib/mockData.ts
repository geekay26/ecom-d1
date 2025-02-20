export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  lastUpdated: Date;
}

// Initial product data
export const productData: Product[] = [
  {
    id: "p1",
    name: "Ergonomic Desk Chair",
    description: "Comfortable office chair with lumbar support",
    price: 299.99,
    inventory: 45,
    category: "Furniture",
    lastUpdated: new Date(),
  },
  {
    id: "p2",
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical gaming keyboard",
    price: 129.99,
    inventory: 100,
    category: "Electronics",
    lastUpdated: new Date(),
  },
  {
    id: "p3",
    name: "4K Monitor",
    description: "32-inch 4K Ultra HD display",
    price: 499.99,
    inventory: 30,
    category: "Electronics",
    lastUpdated: new Date(),
  },
  {
    id: "p4",
    name: "Coffee Table",
    description: "Modern wooden coffee table",
    price: 199.99,
    inventory: 25,
    category: "Furniture",
    lastUpdated: new Date(),
  },
  {
    id: "p5",
    name: "Wireless Mouse",
    description: "High-precision wireless gaming mouse",
    price: 79.99,
    inventory: 150,
    category: "Electronics",
    lastUpdated: new Date(),
  },
  {
    id: "p6",
    name: "Bookshelf",
    description: "5-tier wooden bookshelf",
    price: 159.99,
    inventory: 35,
    category: "Furniture",
    lastUpdated: new Date(),
  },
  {
    id: "p7",
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI and power delivery",
    price: 49.99,
    inventory: 200,
    category: "Electronics",
    lastUpdated: new Date(),
  },
  {
    id: "p8",
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness",
    price: 39.99,
    inventory: 80,
    category: "Lighting",
    lastUpdated: new Date(),
  },
  {
    id: "p9",
    name: "Standing Desk",
    description: "Electric height-adjustable standing desk",
    price: 599.99,
    inventory: 20,
    category: "Furniture",
    lastUpdated: new Date(),
  },
  {
    id: "p10",
    name: "Ceiling Light",
    description: "Modern LED ceiling light fixture",
    price: 129.99,
    inventory: 40,
    category: "Lighting",
    lastUpdated: new Date(),
  },
];

// Simulate multiple read replicas
const replicas = [[...productData], [...productData], [...productData]];

let currentReplicaIndex = 0;
let primaryData = [...productData];

// Simulate replica lag by delaying updates
const updateReplicas = async (updatedProduct: Product) => {
  // Update primary immediately
  const primaryIndex = primaryData.findIndex((p) => p.id === updatedProduct.id);
  if (primaryIndex !== -1) {
    primaryData[primaryIndex] = updatedProduct;
  } else {
    primaryData.push(updatedProduct);
  }

  // Update replicas with varying delays
  replicas.forEach((replica, index) => {
    setTimeout(() => {
      const replicaIndex = replica.findIndex((p) => p.id === updatedProduct.id);
      if (replicaIndex !== -1) {
        replica[replicaIndex] = updatedProduct;
      } else {
        replica.push(updatedProduct);
      }
    }, (index + 1) * 100); // Simulate different replication delays
  });
};

// Mock database functions
export const mockDb = {
  // Read operations (using replicas with round-robin)
  getProducts: async () => {
    currentReplicaIndex = (currentReplicaIndex + 1) % replicas.length;
    return replicas[currentReplicaIndex];
  },

  getProduct: async (id: string) => {
    currentReplicaIndex = (currentReplicaIndex + 1) % replicas.length;
    return replicas[currentReplicaIndex].find((p) => p.id === id);
  },

  getProductsByCategory: async (category: string) => {
    currentReplicaIndex = (currentReplicaIndex + 1) % replicas.length;
    return replicas[currentReplicaIndex].filter((p) => p.category === category);
  },

  // Write operations (to primary)
  updateProduct: async (id: string, data: Partial<Product>) => {
    const product = primaryData.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");

    const updatedProduct = {
      ...product,
      ...data,
      lastUpdated: new Date(),
    };

    await updateReplicas(updatedProduct);
    return updatedProduct;
  },

  // Simulate ERP sync
  syncProductsFromERP: async () => {
    const mockErpData = [
      {
        id: "p11",
        name: "New Product",
        description: "Recently added product",
        price: 89.99,
        inventory: 50,
        category: "Electronics",
        lastUpdated: new Date(),
      },
    ];

    for (const product of mockErpData) {
      await updateReplicas(product);
    }

    return mockErpData;
  },
};
