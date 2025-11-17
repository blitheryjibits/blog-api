import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/prisma/client.js', () => ({
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const request = (await import('supertest')).default;
const app = (import('../../index.js'));
const prisma = (await import('../../src/prisma/client.js')).default;
const bcrypt = await import('bcryptjs');
const jwt = await import('jsonwebtoken');

describe('POST /register', () => {
  it('should create a user and return a token', async () => {
    const mockUser = { id: 1, username: 'robert', email: 'rob@example.com' };
    prisma.user.create.mockResolvedValue(mockUser);
    bcrypt.hashSync.mockReturnValue('hashedPassword');
    jwt.sign.mockReturnValue('mockToken');

    const res = await request(app)
      .post('/register')
      .send({
        username: 'robert',
        email: 'rob@example.com',
        password: 'SecureP@ss1',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBe('mockToken');
  });
});


describe('POST /register', () => {
  it('should create a user and return a token', async () => {
    const mockUser = { id: 1, username: 'robert', email: 'rob@example.com' };
    prisma.user.create.mockResolvedValue(mockUser);
    bcrypt.hashSync.mockReturnValue('hashedPassword');
    jwt.sign.mockReturnValue('mockToken');

    const res = await request(app)
      .post('/register')
      .send({
        username: 'robert',
        email: 'rob@example.com',
        password: 'SecureP@ss1'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBe('mockToken');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'robert',
        email: 'rob@example.com',
        password: 'hashedPassword'
      }
    });
  });
});


describe('POST /login', () => {
  it('should return token for valid credentials', async () => {
    const mockUser = { id: 1, email: 'rob@example.com', password: 'hashedPassword' };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue('mockToken');

    const res = await request(app)
      .post('/login')
      .send({
        email: 'rob@example.com',
        password: 'SecureP@ss1'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBe('mockToken');
  });

  it('should return 401 for invalid password', async () => {
    prisma.user.findUnique.mockResolvedValue({ password: 'hashedPassword' });
    bcrypt.compareSync.mockReturnValue(false);

    const res = await request(app)
      .post('/login')
      .send({
        email: 'rob@example.com',
        password: 'WrongPass'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should return 404 for unknown user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/login')
      .send({
        email: 'unknown@example.com',
        password: 'SecureP@ss1'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});


it('should return 400 for invalid email', async () => {
  const res = await request(app)
    .post('/register')
    .send({
      username: 'rob',
      email: 'not-an-email',
      password: 'SecureP@ss1'
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toBeDefined();
});

