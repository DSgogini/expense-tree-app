import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import type { CategoryRepository } from "../../domain/category/CategoryRepository";
import { Category } from "../../domain/category/Category";

const categoriesCollection = collection(db, "categories");

export class CategoryFirestoreRepository implements CategoryRepository {
  async addCategory(category: Category): Promise<void> {
    await addDoc(categoriesCollection, category.toPersistence());
  }

  async fetchCategories(): Promise<Category[]> {
    const categoriesQuery = query(categoriesCollection, orderBy("name", "asc"), limit(100));
    const snapshot = await getDocs(categoriesQuery);

    return snapshot.docs.map((doc) =>
      Category.fromPersistence({ id: doc.id, ...doc.data() })
    );
  }
}
