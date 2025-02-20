export const prerender = false;

import type { APIRoute } from "astro";
import { getProductFromDatabase } from "../../lib/products";

export const GET: APIRoute = async ({ request, locals, cookies }) => {
  // get cookies from the request
  const cookie = cookies.get("product_bookmark")?.value;
  console.log(cookie);

  try {
    // const results = await getProductFromDatabase(locals.runtime.env.DB, cookie);
    return new Response(JSON.stringify({ message: "product updated" }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};
