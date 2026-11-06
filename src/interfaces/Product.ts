interface ProductInput {
  code?: unknown;
  description?: unknown;
  status?: unknown;
  photo?: string;
}

interface CreateProductData {
  code: string;
  description: string;
  status: boolean;
  photo?: string;
}

interface UpdateProductData {
  code?: string;
  description?: string;
  status?: boolean;
  photo?: string | null;
}

export { CreateProductData, ProductInput, UpdateProductData };
