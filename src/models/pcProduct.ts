import type { Product } from "./product.js";

export interface PcProduct {
  id: string,
  components: Product[],
  assembly: boolean
}