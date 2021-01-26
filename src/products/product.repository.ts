import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async getAllProductsRepository(user: User) {
    const products = await this.find({ where: { userId: user.id } });
    return products;
  }

  async createProductRepository(
    createProductDto: CreateProductDto,
    filename: any,
    user: User,
  ): Promise<Product> {
    try {
      const { name, description, price } = createProductDto;

      const product = new Product();
      product.name = name;
      product.description = description;
      product.price = price;
      product.image = filename;
      product.user = user;

      await product.save();

      delete product.user;

      return product;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
