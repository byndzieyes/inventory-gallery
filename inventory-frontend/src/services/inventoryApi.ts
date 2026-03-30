import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export interface InventoryItem {
  id: number;
  inventory_name: string;
  description: string;
  photo: string | null;
}

export const inventoryApi = {
  // Отримати всі товари
  getInventory: () => axios.get<InventoryItem[]>(`${BASE_URL}/inventory`),

  // Отримати один товар
  getItem: (id: number) => axios.get<InventoryItem>(`${BASE_URL}/inventory/${id}`),

  // Створити новий (FormData, бо є файл)
  createItem: (data: FormData) => axios.post<InventoryItem>(`${BASE_URL}/register`, data),

  // Оновити текстові поля
  updateText: (id: number, data: { inventory_name?: string; description?: string }) =>
    axios.put<InventoryItem>(`${BASE_URL}/inventory/${id}`, data),

  // Оновити фото (FormData)
  updatePhoto: (id: number, data: FormData) => axios.put<InventoryItem>(`${BASE_URL}/inventory/${id}/photo`, data),

  // Видалити товар
  deleteItem: (id: number) => axios.delete(`${BASE_URL}/inventory/${id}`),
};
