import { request } from "../axios/axios";

export async function deletePost(id) {
  const response = await request.delete(`/api/posts/${id}`);
  return response;
}
