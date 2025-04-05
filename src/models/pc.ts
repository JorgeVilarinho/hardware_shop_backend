import type { Product } from "./product.js";

export interface Pc {
  id: number,
  components: Product[],
  assembly: boolean
}