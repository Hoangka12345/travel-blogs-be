import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  dotenv.config()

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT || 5000
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
