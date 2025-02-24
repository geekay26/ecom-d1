export const prerender = false;

import type { APIRoute } from "astro";
import { z } from "zod";
import {
  updateProductInDatabase,
  createProductInDatabase,
  getProductFromDatabase,
} from "../../lib/products";

const productSchema = z.object({
  id: z.string().min(2, "ID is required"),
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  inventory: z.number().optional(),
  category: z.string().optional(),
});

// this endpoint get's triggered when a product is updated in the ERP system
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const body = await request.json();
  try {
    const product = productSchema.parse(body);
    const { id } = product;
    const db = locals.runtime.env.DB;
    const session = db.withSession("first-primary");
    console.log("bookmark in sync", cookies.get("product_bookmark")?.value);
    // Check if product exists
    const existingProduct = await getProductFromDatabase(session, id);
    if (existingProduct.result) {
      console.log("updating product");
      // Update existing product
      const { bookmark } = await updateProductInDatabase(db, id, product);
      console.log("bookmark", bookmark);
      // set bookmark as cookie
      cookies.set("product_bookmark", bookmark, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      return new Response(JSON.stringify({ message: "product updated" }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    } else {
      // Create new product
      console.log("creating product");
      const { bookmark } = await createProductInDatabase(db, product);
      console.log("bookmark", bookmark);
      // set bookmark as cookie
      cookies.set("product_bookmark", bookmark, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return new Response(JSON.stringify({ message: "new prouct added" }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};
