import Product from "@/schema/Product";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const products = await Product.find();
      res.send({
        status: true,
        entity: products,
      });
    } catch (err) {
      res.send({
        status: false,
        entity: {
          massage: "error in getting all product",
          err,
        },
      });
    }
  } else {
    res.status(405).json({ message: "path not define" }).end(); // Method Not Allowed
  }
};
