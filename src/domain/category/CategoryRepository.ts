import { Category } from "./Category";

export interface CategoryRepository {
  addCategory(category: Category): Promise<void>;
  fetchCategories(): Promise<Category[]>;
}
