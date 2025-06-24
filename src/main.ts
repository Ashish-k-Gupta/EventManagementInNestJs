import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT ?? 30001);
  console.log(`Server is running on port http://localhost:${PORT}`);
}
void bootstrap();
