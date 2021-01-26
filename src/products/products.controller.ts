import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helper/image-filename.helper';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getAllProductsController(@GetUser() user: User): Promise<Product[]> {
    return this.productsService.getAllProductsService(user);
  }

  @Get('/:id')
  getProductController(
    @Param('id', ParseIntPipe)
    id: number,
    @GetUser()
    user: User,
  ): Promise<Product> {
    return this.productsService.getProductService(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  createProductController(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: any,
    @GetUser() user: User,
  ): Promise<Product> {
    if (!image) {
      throw new BadRequestException(['image photo is required'], 'Bad Request');
    }
    const { filename } = image;
    return this.productsService.createProductService(
      createProductDto,
      filename,
      user,
    );
  }

  @Delete('/:id')
  deleteProductController(
    @Param('id', ParseIntPipe)
    id: number,
    @GetUser()
    user: User,
  ) {
    return this.productsService.deleteProductService(id, user);
  }
}
