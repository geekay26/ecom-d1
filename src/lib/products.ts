import { mockDb } from "./mockData";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  inventory: number;
  last_updated: string;
  created_at: string;
}

export const getProducts = () => mockDb.getProducts();
export const getProduct = (id: string) => mockDb.getProduct(id);
export const getProductsByCategory = (category: string) =>
  mockDb.getProductsByCategory(category);
export const updateProduct = (id: string, data: any) =>
  mockDb.updateProduct(id, data);
export const syncProductsFromERP = () => mockDb.syncProductsFromERP();

export const updateProductInDatabase = async (
  db: D1Database,
  id: string,
  product: Partial<Product>
) => {
  try {
    const updates = Object.entries(product)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`)
      .join(", ");

    if (!updates) {
      throw new Error("No valid fields to update");
    }

    const values = Object.entries(product)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => value);

    const session = db.withSession("first-primary");
    const statement = session.prepare(
      `UPDATE products SET ${updates} WHERE id = ?`
    );
    const { results } = await statement.bind(...[...values, id]).run();
    return { results, bookmark: session.getBookmark() };
  } catch (error) {
    throw new Error(`Failed to update product in database: ${error.message}`);
  }
};

export const createProductInDatabase = async (
  db: D1Database,
  product: Omit<Product, "created_at" | "last_updated">
) => {
  try {
    const now = new Date().toISOString();
    const fields = [...Object.keys(product), "created_at", "last_updated"];

    const values = [...Object.values(product), now, now];
    console.log(values);
    const session = db.withSession("first-primary");
    const statement = session.prepare(
      `INSERT INTO products (${fields.join(", ")}) VALUES (${fields
        .map(() => "?")
        .join(", ")})`
    );
    const { results } = await statement.bind(...values).run();
    return { results, bookmark: session.getBookmark() };
  } catch (error) {
    throw new Error(`Failed to create product in database: ${error.message}`);
  }
};

export const getProductFromDatabase = async (db: D1Database, id: string) => {
  try {
    if (!id) {
      throw new Error("No ID provided");
    }
    const result = await db
      .prepare("SELECT * FROM products WHERE id = ?")
      .bind(id)
      .first();

    return result;
  } catch (error) {
    throw new Error(`Failed to get product from database: ${error.message}`);
  }
};

export const getProductsFromDatabase = async (
  db: D1Database,
  bookmark?: string
) => {
  try {
    const session = db.withSession(bookmark ? bookmark : "first-unconstrained");
    const results = await session.prepare("SELECT * FROM products").run();
    return results;
  } catch (error) {
    throw new Error(`Failed to get products from database: ${error.message}`);
  }
};
