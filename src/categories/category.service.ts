/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { generateBaseSlug } from "src/common/utils/slug.generator";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

private async generateUniqueSlug(name: string, existingId?: string): Promise<string>{
  const baseSlug = generateBaseSlug(name);
  let uniqueSlug = baseSlug;
  let counter = 1;
  
  while(true){
    const foundCatergory = await this.categoryRepository.findOne({
      where: {slug: uniqueSlug}
    });

  if(!foundCatergory || (existingId && foundCatergory.id === existingId)){
      return uniqueSlug;
    }
    uniqueSlug = `${uniqueSlug}-${counter}`
    counter++ 
  }
}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, description } = createCategoryDto;
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      throw new ConflictException(`Category with name "${name} already exists`);
    }

    const uniqueSlug = await this.generateUniqueSlug(name);

    const newCategory = this.categoryRepository.create({
      name,
      slug: uniqueSlug,
      description,
    });
    return this.categoryRepository.save(newCategory);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // const { name, description } = updateCategoryDto;
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`category with "${id}" not found.`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const uniqueSlug = await this.generateUniqueSlug(
        updateCategoryDto.name,
        id,
      );
      category.name = updateCategoryDto.name;
      category.slug = uniqueSlug;
    }
    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }
    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException(`Category with slug "${slug} not found"`);
    }
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found.`);
    }
  }
}
