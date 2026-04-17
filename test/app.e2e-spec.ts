import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('TasksController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a task with success', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Estudar testes e2e',
          completed: false,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Estudar testes e2e');
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should create a task with description and dueDate', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Estudar Prisma',
          description: 'Revisar migrations e client',
          dueDate: '2026-04-25T18:00:00.000Z',
          completed: false,
        })
        .expect(201);

      expect(response.body.title).toBe('Estudar Prisma');
      expect(response.body.description).toBe('Revisar migrations e client');
      expect(response.body.dueDate).toBe('2026-04-25T18:00:00.000Z');
      expect(response.body.completed).toBe(false);
    });

    it('should create a task without completed field and using default value', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task sem completed',
        })
        .expect(201);

      expect(response.body.title).toBe('Task sem completed');
      expect(response.body.completed).toBe(false);
    });

    it('deve falhar ao criar task sem title', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          completed: false,
        })
        .expect(400);
    });

    it('deve falhar ao enviar campo extra', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task inválida',
          completed: false,
          extraField: 'não permitido',
        })
        .expect(400);
    });

    it('deve falhar ao enviar dueDate inválido', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task com data inválida',
          dueDate: 'amanha de tarde',
        })
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('deve listar todas as tasks', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', completed: false },
          { title: 'Task 2', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('deve retornar description e dueDate quando existirem', async () => {
      await prisma.task.create({
        data: {
          title: 'Task completa',
          description: 'Descrição da task',
          dueDate: new Date('2026-04-25T18:00:00.000Z'),
          completed: false,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body[0].description).toBe('Descrição da task');
      expect(response.body[0].dueDate).toBe('2026-04-25T18:00:00.000Z');
    });

    it('deve filtrar por completed=true', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Concluída', completed: true },
          { title: 'Pendente', completed: false },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/tasks?completed=true')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Concluída');
      expect(response.body[0].completed).toBe(true);
    });

    it('deve filtrar por completed=false', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Concluída', completed: true },
          { title: 'Pendente', completed: false },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/tasks?completed=false')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Pendente');
      expect(response.body[0].completed).toBe(false);
    });

    it('deve filtrar por search', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Estudar NestJS', completed: false },
          { title: 'Comprar pão', completed: false },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/tasks?search=nest')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Estudar NestJS');
    });

    it('deve combinar completed e search', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Estudar NestJS', completed: true },
          { title: 'Estudar Prisma', completed: false },
          { title: 'Comprar pão', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/tasks?completed=true&search=estudar')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Estudar NestJS');
      expect(response.body[0].completed).toBe(true);
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('deve buscar uma task existente por id', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Buscar por id',
          description: 'Detalhes da task',
          dueDate: new Date('2026-04-25T18:00:00.000Z'),
          completed: false,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Buscar por id');
      expect(response.body.description).toBe('Detalhes da task');
      expect(response.body.dueDate).toBe('2026-04-25T18:00:00.000Z');
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .get('/tasks/9999')
        .expect(404);
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('deve atualizar uma task existente', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Task original',
          completed: false,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({
          title: 'Task atualizada',
          description: 'Nova descrição',
          dueDate: '2026-04-30T20:00:00.000Z',
          completed: true,
        })
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Task atualizada');
      expect(response.body.description).toBe('Nova descrição');
      expect(response.body.dueDate).toBe('2026-04-30T20:00:00.000Z');
      expect(response.body.completed).toBe(true);
    });

    it('deve retornar 404 ao atualizar id inexistente', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/9999')
        .send({
          title: 'Não existe',
        })
        .expect(404);
    });

    it('deve falhar ao enviar campo extra no update', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Task original',
          completed: false,
        },
      });

      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({
          extraField: 'não permitido',
        })
        .expect(400);
    });

    it('deve falhar ao enviar dueDate inválido no update', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Task original',
          completed: false,
        },
      });

      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({
          dueDate: 'data errada',
        })
        .expect(400);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('deve remover uma task existente', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Task para deletar',
          completed: false,
        },
      });

      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(200);

      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });

      expect(deletedTask).toBeNull();
    });

    it('deve retornar 404 ao remover id inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/9999')
        .expect(404);
    });
  });
});
