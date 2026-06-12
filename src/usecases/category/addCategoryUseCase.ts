import type { CategoryRepository } from "../../domain/category/CategoryRepository";
import { Category } from "../../domain/category/Category";

export const addCategoryUseCase = async (
  repository: CategoryRepository,
  category: Category
): Promise<void> => {
  await repository.addCategory(category);
};
