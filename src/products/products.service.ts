import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { promises as fs } from 'fs';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  getAllProductsService(user: User): Promise<Product[]> {
    return this.productRepository.getAllProductsRepository(user);
  }

  async getProductService(id: number, user: User): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  createProductService(
    createProductDto: CreateProductDto,
    filename: any,
    user: User,
  ): Promise<Product> {
    return this.productRepository.createProductRepository(
      createProductDto,
      filename,
      user,
    );
  }

  async deleteProductService(id: number, user: User): Promise<void> {
    const product = await this.getProductService(id, user);

    await fs.unlink(`./uploads/${product.image}`);
    await product.remove();
  }
}
