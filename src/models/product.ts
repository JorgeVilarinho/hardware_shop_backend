export interface Product {
  id: number,
  nombre: string,
  descripcion: string,
  marca: string,
  categoria: string,
  descuento?: number,
  unidades: number,
  precio: number,
  imagen: string
}