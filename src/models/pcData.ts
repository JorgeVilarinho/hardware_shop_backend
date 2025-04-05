import type { Product } from "./product.js";

export interface PcData {
  components: Product[],
  assembly: boolean
}