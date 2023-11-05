import { getAllProducts, singleProduct } from "@/services/databaseApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function products() {
  const [productData, setProductData] = useState();
  const [productImages, setProductImages] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  const router = useRouter();
  const query = router.query;
  const productId = query.pid;

  // api call and show a single product for display in page
  useEffect(() => {
    singleProduct(productId)
      .then((responce) => {
        if (responce.status) {
          setProductData(responce.entity);
          setProductImages(responce.entity.image);
          setPageReady(true);
        }
      })
      .catch((error) => console.log("product id error", error));
  }, [productId]);

  return (
    <div>
      <div className="w-full md:px-20 px-4 mt-5 mx-auto">
        <div className="border rounded-lg shadow ">
          <div className="bg-slate-100 p-4 flex flex-row justify-between">
            <span className="font-bold text-xl">Product-id : {productId} </span>
            <button
              className="bg-red-600 text-white px-2 rounded-md hover:bg-red-700 font-semibold text-lg"
              onClick={() => router.push("/")}
            >
              <span>X</span>
            </button>
          </div>
          <div className="flex flex-row justify-evenly flex-wrap p-2 ">
            <div className="flex-grow">
              <div className="flex space-x-1">
                <p className="font-medium">Product name :</p>
                <p>{productData?.name}</p>
              </div>
              <div className="flex space-x-1">
                <p className="font-medium">Product description :</p>
                <p>{productData?.description}</p>
              </div>
              <div>
                <div className="flex space-x-1">
                  <p className="font-medium">currency type :</p>
                  <p>{productData?.price.currencyType}</p>
                </div>
                <div className="pl-4">
                  <p>Mrp : {productData?.price.mrp}</p>
                  <p>selling price : {productData?.price.sellingPrice}</p>
                </div>
              </div>
            </div>
            <div className="md:w-[36rem] w-[24rem] flex flex-row flex-wrap">
              {pageReady &&
                productImages.map((image, i) => (
                  <p id={i} className="md:w-48 w-32 md:h-48 h-32  p-2">
                    <img src={image} className="h-full w-full" />
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default products;
