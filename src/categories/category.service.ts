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
    existingId?: string,
  ): Promise<string> {
    const baseSlug = generateBaseSlug(name);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });

      if (
        !existingCategory ||
        (existingCategory && existingId === existingCategory.id)
      ) {
        return uniqueSlug;
      }
      uniqueSlug = `${uniqueSlug}-${counter}`;
      counter++;
    }
  }

  async createCategory(
    id: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, description } = createCategoryDto;
    const existingCategoryByName = await this.categoryRepository.findOne({
      where: { name: name },
    });

    if (existingCategoryByName) {
      throw new ConflictException(
        `Category with name "${name}" already exists`,
      );
    }

    const uniqueSlug = await this.generateUniqueSlug(name);
    const newCategory = this.categoryRepository.create({
      name: name,
      slug: uniqueSlug,
      description: description,
    });
    return await this.categoryRepository.save(newCategory);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with "${id}" do not exists`);
    }

    if (
      updateCategoryDto.name &&
      updateCategoryDto.name !== existingCategory.name
    ) {
      const nameConflict = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
      existingCategory.name = updateCategoryDto.name;
      existingCategory.slug = await this.generateUniqueSlug(
        updateCategoryDto.name,
        id,
      );
    }
    if (updateCategoryDto.description !== undefined) {
      existingCategory.description = updateCategoryDto.description;
    }
    return await this.categoryRepository.save(existingCategory);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async softRemove(id: string): Promise<void> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID "${id}" doesn't exists.`);
    }
    await this.categoryRepository.softRemove(existingCategory);
  }
}
