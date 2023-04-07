import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productsService:ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ){}

  async runSeed(){

    await this.deleteTables()

    const adminUser = await this.insertUser()

    await this.insertProducts(adminUser);

    return 'Seed Executed';
  }

  private async deleteTables(){

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder()

    await queryBuilder
      .delete()
      .where({})
      .execute()


  }

  private async insertUser(){

    const seedUsers = initialData.users;

    const users:User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    })

    const dbUsers = this.userRepository.save(seedUsers)

    return dbUsers[0]

  }

  private async insertProducts(user:User){

    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product,user));
    })

    await Promise.all( insertPromises )

    return true;

  }
}
