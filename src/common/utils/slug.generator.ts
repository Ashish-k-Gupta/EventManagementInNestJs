import slugify from "slugify";

export function generateBaseSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    trim: true,
  });
}
