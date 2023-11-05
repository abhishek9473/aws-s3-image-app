import connectDB from "@/db";
import Product from "@/schema/Product";

export default async (req, res) => {
  connectDB();

  if (req.method === "POST") {
    try {
      const sampleProduct = {
        name: req.body.name,
        description: req.body.description,
        price: {
          currencyType: req.body.currencyType,
          mrp: req.body.mrp,
          sellingPrice: req.body.sellingPrice,
        },
        image: req.body.newArrayOfImages,
      };

      const newProduct = new Product(sampleProduct);
      const insertedProduct = await newProduct.save();
      res.send({
        status: true,
        entity: insertedProduct,
      });
    } catch (err) {
      res.send({
        status: false,
        entity: {
          massage: "error in adding product in api page",
          err,
        },
      });
    }
  } else {
    res.status(405).json({ message: "path not define" }).end(); // Method Not Allowed
  }
};
