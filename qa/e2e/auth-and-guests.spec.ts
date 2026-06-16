import { test, expect } from '@playwright/test';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const SUPER_ADMIN_TOKEN_CACHE = { token: '' };

test.describe('🔐 Authentication Flows', () => {
  test('Super Admin login should return a valid JWT', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/v1/auth/login`, {
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
    const res = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: { email: 'wrong@email.com', password: 'WrongPass!' },
    });
    expect(res.status()).toBe(401);
  });

  test('Protected route should reject unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v1/super-admin/admins`);
    expect(res.status()).toBe(401);
  });
});

test.describe('👤 Default Admin (UserEven)', () => {
  test('UserEven should login with alias identifier', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: { email: 'UserEven', password: 'User123@' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data?.accessToken).toBeDefined();
    expect(body.data?.user?.role).toBe('ADMIN');
  });

  test('UserEven should create an event', async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: { email: 'UserEven', password: 'User123@' },
    });
    expect(loginRes.ok()).toBeTruthy();
    const { data } = await loginRes.json();
    const token = data.accessToken as string;

    const slug = `mariage-usereven-${Date.now()}`;
    const createRes = await request.post(`${API_BASE}/api/v1/events`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'Mariage UserEven Demo',
        slug,
        eventType: 'wedding',
        startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      },
    });
    expect(createRes.status()).toBe(201);
    const eventBody = await createRes.json();
    const event = eventBody.data ?? eventBody;
    expect(event.id).toBeDefined();
  });

  test('UserEven should access guest list on own event', async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: { email: 'usereven@smartevent.com', password: 'User123@' },
    });
    const { data } = await loginRes.json();
    const token = data.accessToken as string;

    const eventsRes = await request.get(`${API_BASE}/api/v1/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(eventsRes.ok()).toBeTruthy();
    const eventsBody = await eventsRes.json();
    const events = eventsBody.data ?? eventsBody;
    expect(Array.isArray(events)).toBeTruthy();

    if (events.length > 0) {
      const guestsRes = await request.get(
        `${API_BASE}/api/v1/events/${events[0].id}/guests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      expect(guestsRes.ok()).toBeTruthy();
    }
  });
});

test.describe('🔒 Role & permission enforcement', () => {
  test('Admin token must not access super-admin stats', async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: { email: 'UserEven', password: 'User123@' },
    });
    const { data } = await loginRes.json();
    const res = await request.get(`${API_BASE}/api/v1/super-admin/stats`, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    expect(res.status()).toBe(403);
  });

  test('Health endpoint is public', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v1/health`);
    expect(res.ok()).toBeTruthy();
  });
});

test.describe('👥 Guest Management', () => {
  test('Should return paginated guest list for authenticated admin', async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: { email: 'superadmin@smartevent.com', password: 'Superadmin123@' },
    });
    expect(loginRes.ok()).toBeTruthy();

    const { data } = await loginRes.json();
    const eventsRes = await request.get(`${API_BASE}/api/v1/events`, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    expect(eventsRes.ok()).toBeTruthy();
    const eventsBody = await eventsRes.json();
    const events = eventsBody.data ?? eventsBody;
    if (Array.isArray(events) && events.length > 0) {
      const res = await request.get(`${API_BASE}/api/v1/events/${events[0].id}/guests`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      expect(res.ok()).toBeTruthy();
    }
  });
});
