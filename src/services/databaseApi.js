import { get, post } from "./httpServices";

export const getAllProducts = () => {
  return get(`/api/product/view`);
};

export const singleProduct = (id) => {
  return get(`/api/product/view/${id}`);
};

export const uploadProduct = (data) => {
  return post(`/api/product/add`, data);
};
