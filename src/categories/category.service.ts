import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { generateBaseSlug } from "src/common/utils/slug.generator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private async generateUniqueSlug(
    name: string,
    existingId: string,
  ): Promise<string> {
    const baseSlug = generateBaseSlug(name);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existingCatergory = await this.categoryRepository.findOne({
        where: { slug: uniqueSlug },
      });

      if (
        !existingCatergory ||
        (existingId && existingCatergory.id === existingId)
      ) {
        return uniqueSlug;
      }
      uniqueSlug = `${uniqueSlug}-${counter}`;
      counter++;
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, description } = createCategoryDto;

    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: name },
    });
    if (existingCategory) {
      throw new ConflictException(`category with name ${name} already exists`);
    }
    const uniqueCategory = generateBaseSlug(createCategoryDto.name);
    const newCategory = this.categoryRepository.create({
      name: name,
      slug: uniqueCategory,
      description: description,
    });

    return await this.categoryRepository.save(newCategory);
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto, id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id "${id} does not exists"`);
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

  async findAllCategory(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async softDeleteCategory(id: string): Promise<void> {
    const categoryToDelete = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!categoryToDelete) {
      throw new NotFoundException(`Category with ${id} does not exists`);
    }
    await this.categoryRepository.softRemove(categoryToDelete);
  }
}
