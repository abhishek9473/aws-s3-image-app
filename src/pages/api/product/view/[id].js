import { connectDB } from "@/db";
import Product from "@/schema/Product";
// connectDB()

export default async (req, res) => {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const products = await Product.findById(id);

      res.send({
        status: true,
        entity: products,
      });
    } catch (err) {
      res.send({
        status: false,
        entity: {
          massage: "error in getting single product",
          err,
        },
      });
    }
  } else {
    res.status(405).json({ message: "path not define" }).end(); // Method Not Allowed
  }
};
