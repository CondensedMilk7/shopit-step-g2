import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../types/product';

@Pipe({
  name: 'productFilter',
})
export class ProductFilterPipe implements PipeTransform {
  transform(value: Product[], text: string): Product[] {
    return value.filter((product) =>
      product.title.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    );
  }
}
