import { compare } from 'bcrypt';
import { Product } from 'src/products/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany((type) => Product, (product) => product.user, { eager: true })
  products: Product[];

  async comparePassword(targetPassword: string): Promise<boolean> {
    return await compare(targetPassword, this.password);
  }
}
