import axios from "axios";
import { BASE_URL } from "@/models/constants";
import { User } from "@/models/types";

export const getUsers = async () => {
  const response = await axios.get(`${BASE_URL}/users`);

  return response?.data;
};

export const getUserById = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/users/${id}`);

  return response?.data;
};

export const createUser = async (
  data: Pick<User, "email" | "name" | "phone">
) => {
  const response = await axios.post(`${BASE_URL}/users`, data);

  return response?.data;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/users/${id}`);

  return response?.data;
};

export const updateUser = async (user: User) => {
  const response = await axios.put(`${BASE_URL}/users/${user?.id}`, user);

  return response?.data;
};
