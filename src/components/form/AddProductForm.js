import React, { useEffect, useState } from "react";
import { uploadProduct } from "@/services/databaseApi";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const awsAccessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("description is required"),
  currencyType: yup.string(),
  mrp: yup
    .number()
    .typeError("mrp must be a number")
    .positive("mrp must be a positive number")
    .integer("mrp must be an integer")
    .required("mrp is required"),
  sellingPrice: yup
    .number()
    .typeError("sellingPrice must be a number")
    .positive("sellingPrice must be a positive number")
    .integer("sellingPrice must be an integer")
    .required("sellingPrice is required"),
});

function AddProductForm({ close, refresh }) {
  const [fileSelectError, setFileSelectError] = useState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "image",
  });

  useEffect(() => {
    return append();
  }, []);

  // s3 client connection
  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  //  this function recive all img data one by one (using map) and return a public url of aws s3 uploaded image
  async function imageUploadHandler(img) {
    if (img.length !== 0) {
      const file = img[0]; // Get the first file from the FileList
      const reader = new FileReader();
      const folderName = "upload/user-upload";

      async function putObjectURL(filename) {
        const command = new PutObjectCommand({
          Bucket: "abhirxl",
          Key: `${folderName}/${filename}`,
        });
        const url = await getSignedUrl(s3Client, command);
        return url;
      }

      const imgType = file.type;
      const parts = imgType.split("/");
      const imgName = `image-${uuidv4()}.${parts[1]}`;
      const URL = await putObjectURL(imgName, imgType);

      return new Promise((resolve, reject) => {
        reader.onload = function () {
          // The reader.result contains the binary data of the image
          const imageBinaryData = reader.result;

          // Create the request object
          const request = new Request(URL, {
            method: "PUT",
            body: imageBinaryData,
            headers: {
              "Content-Type": file.type, // Set the appropriate content type for your image
            },
          });

          // Send the PUT request to aws s3 for upload the file
          fetch(request)
            .then((response) => {
              if (response.ok) {
                const uploadedFileUrl = `https://abhirxl.s3.ap-south-1.amazonaws.com/${folderName}/${imgName}`;
                resolve(uploadedFileUrl);
              } else {
                reject(new Error("PUT request failed"));
              }
            })
            .catch((error) => {
              reject(error);
            });
        };

        reader.readAsArrayBuffer(file);
      });
    }
  }

  // mongodb api call handler and form data submit handler
  const formDataHandler = async (data) => {
    let imgData = [];

    if (data.image && data.image.length > 0) {
      // Use Promise.all to handle multiple image uploads concurrently
      imgData = await Promise.all(
        data.image.map(async (item) => {
          try {
            const imgUrl = await imageUploadHandler(item);
            return imgUrl;
          } catch (error) {
            console.error(error);
            return null; // Handle upload errors as needed
          }
        })
      );
    }

    // create a new image list array after removing undefine entries
    const newArrayOfImages = [];
    for (let item of imgData) {
      if (item !== undefined) {
        newArrayOfImages.push(item);
      }
    }

    // check if use not select any image then show a error
    if (newArrayOfImages.length > 0) {
      const newFormData = { ...data, newArrayOfImages };
      delete newFormData.image;
      console.log(newFormData);

      // post api call
      uploadProduct(newFormData)
        .then((res) => {
          if (res.status) {
            reset();
            close();
            refresh ? refresh() : null;
          }
        })
        .catch((err) => console.log(`error in adding product : ${err}`));
    } else setFileSelectError("(minimum select one)");
  };

  // this function add anew dynamic field for image input
  const addImageFieldHandler = () => {
    if (fields.length < 6) {
      append();
    }
  };

  return (
    <div className="bg-slate-100 flex flex-col">
      <div className="bg-slate-300 font-semibold text-xl text-center py-1 ">
        Add New Product
      </div>

      <form onSubmit={handleSubmit(formDataHandler)}>
        <div className="flex flex-col justify-between grow">
          {/* 1 */}
          <div className="flex flex-row flex-wrap md:flex-nowrap">
            {/* A left side :: product discription */}
            <div className="space-y-4 px-2 py-2">
              <div className="flex flex-row gap-2 justify-between">
                <div>
                  <label htmlFor="newProductName" className="font-medium">
                    Product Name
                  </label>
                  <p className="absolute text-red-600 text-sm">
                    {errors.name?.message}
                  </p>
                </div>
                <input
                  type="text"
                  className="border w-48"
                  id="newProductName"
                  {...register("name")}
                />
              </div>
              <div className="flex flex-row justify-between gap-2">
                <div>
                  <label htmlFor="newProductDetail" className="font-medium">
                    Product Discription
                  </label>
                  <p className="absolute text-red-600 text-sm">
                    {errors.description?.message}
                  </p>
                </div>
                <textarea
                  id="newProductDetail"
                  rows={4}
                  className="border overflow-auto resize-none w-48"
                  {...register("description")}
                />
              </div>

              <div className="flex justify-between">
                <label htmlFor="type" className="font-medium">
                  Price{" "}
                  <span className="text-sm font-normal text-gray-800">
                    (select currency type)
                  </span>
                </label>
                <select
                  {...register("currencyType")}
                  id="type"
                  className="w-48"
                >
                  <option value={"rupee"} selected>
                    rupee
                  </option>
                  <option value={"dollar"}>dollar</option>
                  <option value={"yen"}>yen</option>
                  <option value={"euro"}>euro</option>
                  <option value={"pound"}>pound</option>
                </select>
              </div>

              <div className="flex flex-row gap-2 justify-between">
                <div>
                  <label htmlFor="newProductMrp" className="font-medium">
                    Mrp
                  </label>
                  <p className="absolute text-red-600 text-sm">
                    {errors.mrp?.message}
                  </p>
                </div>
                <input
                  type="text"
                  className="border w-48"
                  id="newProductMrp"
                  {...register("mrp")}
                />
              </div>
              <div className="flex flex-row gap-2 justify-between">
                <div>
                  <label htmlFor="newProductsp" className="font-medium">
                    selling price
                  </label>
                  <p className="absolute text-red-600 text-sm">
                    {errors.sellingPrice?.message}
                  </p>
                </div>
                <input
                  type="text"
                  className="border w-48"
                  id="newProductsp"
                  {...register("sellingPrice")}
                />
              </div>
            </div>
            {/* B left side :: product image */}
            <div className="w-96 flex-grow px-2 py-2 md:border-l-2 border-t-2 md:border-t-0 ">
              <div className=" flex flex-row justify-between">
                <span className="h-12">
                  <span>Images (min-1 , max-6)</span>
                  <p className="absolute text-red-600 text-sm">
                    {fileSelectError}
                  </p>
                </span>
                <span>
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-black text-white px-1 py-1 flex flex-row space-x-1 cursor-pointer"
                    onClick={() => addImageFieldHandler()}
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
                    <span>add</span>
                  </button>
                </span>
              </div>

              <div>
                {/* dynamic input feild start */}

                {fields.map((field, i) => (
                  <div
                    key={i}
                    className="shadow-md border border-slate-200 flex flex-row justify-between"
                  >
                    <div className="flex justify-between">
                      <div className="">
                        <input
                          className="w-60"
                          type="file"
                          {...register(`image.${i}`)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* dynamic feild end */}
              </div>
            </div>
          </div>

          {/* lower part buttons only */}
          {/* 2 */}
          <div className="flex justify-end pr-4 space-x-4 pb-1">
            <button type="submit" className="button">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;
