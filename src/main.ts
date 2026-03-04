import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('FoodDash API')
    .setDescription(
      "API REST pour l'application de livraison de nourriture FoodDash. " +
        'Gestion des catégories, plats, panier, commandes, promos et moyens de paiement.',
    )
    .setVersion('1.0')
    .addTag('Categories', 'Gestion des catégories de plats')
    .addTag('Foods', 'Gestion des plats / nourriture')
    .addTag('Cart', 'Gestion du panier')
    .addTag('Orders', 'Gestion des commandes')
    .addTag('Promos', 'Bannières promotionnelles')
    .addTag('Payment Methods', 'Moyens de paiement disponibles')
    .addTag('Seed', 'Initialisation des données de test')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 FoodDash API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
void bootstrap();
