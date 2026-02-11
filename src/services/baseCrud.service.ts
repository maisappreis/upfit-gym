import axios from "axios";

export function crudService<T, CreateDTO, UpdateDTO>(
  baseUrl: string
) {
  return {
    async fetchAll(): Promise<T[]> {
      const { data } = await axios.get<T[]>(`/${baseUrl}/`);
      return data;
    },

    async create(payload: CreateDTO): Promise<T> {
      const { data } = await axios.post<T>(
        `/${baseUrl}/create/`,
        payload
      );
      return data;
    },

    async update(id: number, payload: UpdateDTO): Promise<T> {
      const { data } = await axios.patch<T>(
        `/${baseUrl}/${id}/`,
        payload
      );
      return data;
    },

    async delete(id: number): Promise<void> {
      await axios.delete(`/${baseUrl}/${id}/`);
    }
  };
};