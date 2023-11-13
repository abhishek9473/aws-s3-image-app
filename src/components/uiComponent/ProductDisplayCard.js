import Image from "next/image";
import React from "react";

function ProductDisplayCard({ data, clickHandler }) {
  const displayImage = data.image[0];
  const cardTitle = data.name;
  const productId = data._id;
  return (
    <div>
      <div className="border w-44 h-64 flex flex-col my-2 justify-between">
        <div className="h-48 border">
          <div className="h-48 border relative">
            <Image
              src={displayImage}
              alt={cardTitle}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="h-4 text-center font-bold  ">{cardTitle}</div>
        <div className="h-12 flex justify-center items-center">
          <button
            onClick={
              clickHandler
                ? () => clickHandler(productId)
                : () => console.log(productId)
            }
            type="button"
            className="button py-1 "
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplayCard;
