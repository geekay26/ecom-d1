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

export const updateProductInDatabase = async (
  session,
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
  session,
  product: Omit<Product, "created_at" | "last_updated">
) => {
  try {
    const now = new Date().toISOString();
    const fields = [...Object.keys(product), "created_at", "last_updated"];

    const values = [...Object.values(product), now, now];

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

export const getProductFromDatabase = async (session, id: string) => {
  try {
    if (!id) {
      throw new Error("No ID provided");
    }
    const tsStart = Date.now();
    const { results, meta } = await session
      .prepare("SELECT * FROM products WHERE id = ?")
      .bind(id)
      .run();
    const d1Duration = Date.now() - tsStart;
    const newBookmark = session.getBookmark();
    return { results, newBookmark, meta, d1Duration };
  } catch (error) {
    throw new Error(`Failed to get product from database: ${error.message}`);
  }
};

export const getProductsFromDatabase = async (session) => {
  try {
    // used to measure the total duration
    const tsStart = Date.now();

    // get all products from the database
    const { results, meta } = await session
      .prepare("SELECT * FROM products")
      .run();

    // Calculate the total duration
    const d1Duration = Date.now() - tsStart;

    const newBookmark = session.getBookmark();

    return { results, newBookmark, meta, d1Duration };
  } catch (error) {
    throw new Error(`Failed to get products from database: ${error.message}`);
  }
};

export const getProductsByCategoryFromDatabase = async (
  session,
  category: string
) => {
  try {
    const tsStart = Date.now();
    const { results, meta } = await session
      .prepare("SELECT * FROM products WHERE category = ?")
      .bind(category)
      .run();
    const d1Duration = Date.now() - tsStart;
    const newBookmark = session.getBookmark();
    return { results, newBookmark, meta, d1Duration };
  } catch (error) {
    throw new Error(`Failed to get products from database: ${error.message}`);
  }
};

export const getAllCategoriesFromDatabase = async (session) => {
  try {
    const { results } = await session
      .prepare("SELECT DISTINCT category FROM products ORDER BY category ASC")
      .run();
    const newBookmark = session.getBookmark();
    return { results, newBookmark };
  } catch (error) {
    throw new Error(`Failed to get categories from database: ${error.message}`);
  }
};
