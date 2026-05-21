import { test, expect } from '@playwright/test';

const SUPER_ADMIN_TOKEN_CACHE = { token: '' };

test.describe('🔐 Authentication Flows', () => {
  test('Super Admin login should return a valid JWT', async ({ request }) => {
    const res = await request.post('/api/auth/superadmin/login', {
      data: {
        email: 'superadmin@smartevent.com',
        password: 'Superadmin123@',
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data?.accessToken).toBeDefined();
    SUPER_ADMIN_TOKEN_CACHE.token = body.data.accessToken;
  });

  test('Should reject login with wrong credentials', async ({ request }) => {
    const res = await request.post('/api/auth/superadmin/login', {
      data: { email: 'wrong@email.com', password: 'WrongPass!' },
    });
    expect(res.status()).toBe(401);
  });

  test('Protected route should reject unauthenticated requests', async ({ request }) => {
    const res = await request.get('/api/superadmin/admins');
    expect(res.status()).toBe(401);
  });
});

test.describe('👥 Guest Management', () => {
  test('Should return paginated guest list for authenticated admin', async ({ request }) => {
    // Uses a test admin (assumes event "test-event" exists)
    const loginRes = await request.post('/api/auth/admin/login', {
      data: { eventId: 'test-event', password: 'User123@' },
    });
    if (!loginRes.ok()) test.skip();

    const { data } = await loginRes.json();
    const res = await request.get('/api/guests', {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toHaveProperty('items');
    expect(body.data).toHaveProperty('pagination');
  });
});
