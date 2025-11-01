export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
};

export type CartItem = {
  id: string;
  quantity: number;
} & Product;
