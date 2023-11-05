import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AddProductForm from "@/components/form/AddProductForm";
import Modal from "@/components/uiComponent/Modal";
import ProductDisplayCard from "@/components/uiComponent/ProductDisplayCard";
import { getAllProducts, uploadProduct } from "@/services/databaseApi";

export default function Home() {
  const router = useRouter();
  const [refreshProduct, setRefreshProduct] = useState(true);
  const [addProductModal, setAddProductModal] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [allProductData, setAllProductData] = useState([]);

  const refreshPage = () => {
    setRefreshProduct(!refreshProduct);
  };

  useEffect(() => {
    getAllProducts()
      .then((responce) => {
        if (responce.status) {
          setAllProductData(responce.entity);
          setPageReady(true);
        }
      })
      .catch((err) => console.log(err));
  }, [refreshProduct]);

  const productDetailPage = (productId) => {
    const queryParams = {
      pid: productId,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/products?${queryString}`);
  };

  const modalCloser = () => {
    setAddProductModal(false);
  };
  return (
    <>
      <Modal isOpen={addProductModal} onClose={modalCloser}>
        <AddProductForm close={modalCloser} refresh={refreshPage} />
      </Modal>

      <nav className="bg-blue-700 text-white py-1">
        <div className="text-center font-semibold text-2xl">PRODUCTS</div>
      </nav>

      <div className="w-full md:px-10 px-4 mt-5 mx-auto">
        <div className="border rounded-lg shadow">
          <div className="bg-slate-100 p-4 flex flex-row justify-between">
            <span className="font-bold text-xl">All Products</span>

            <button
              className="button flex flex-row space-x-2"
              onClick={() => setAddProductModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Add New</span>
            </button>
          </div>
          <div className="flex flex-row gap-6 pl-2 flex-wrap">
            {/* <div className="px-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 "> */}
            {pageReady &&
              allProductData?.map((product, i) => (
                <ProductDisplayCard
                  data={product}
                  key={i}
                  clickHandler={productDetailPage}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
