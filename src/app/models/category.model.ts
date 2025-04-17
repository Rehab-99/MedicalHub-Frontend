export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
  type: string;
}

export interface CategoryResponse {
  status: number;
  message: string;
  data: Category[];
} 