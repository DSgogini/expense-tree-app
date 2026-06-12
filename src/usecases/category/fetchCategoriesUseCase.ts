import type { CategoryRepository } from "../../domain/category/CategoryRepository";
import { Category } from "../../domain/category/Category";

export const fetchCategoriesUseCase = async (
  repository: CategoryRepository
): Promise<Category[]> => {
  return repository.fetchCategories();
};
