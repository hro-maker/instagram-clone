import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser';

dotenv.config({
  path:'./.env'
})
async function bootstrap() {
  const PORT=process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors()
  await app.listen(PORT).then(()=>{
    console.log("server startet on port "+PORT)
  });
}
bootstrap();