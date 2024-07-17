import { expect } from 'playwright/test';


export async function deleteUserIfExists(request, email) {
    const getUserByEmail = await request.get(`api/users?email=${email}`);
    const body = await getUserByEmail.json();
    if (body.length > 0) {
      const loginToGetAccessToken = await request.post('api/login', {
        data: { email: email, password: 'testPassword' },
      });
      const accessTokenBody = await loginToGetAccessToken.json();
      const accessToken = accessTokenBody.access_token;
      const userId = body[0].id;
      const deleteUser = await request.delete(`api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(deleteUser.ok()).toBeTruthy();
    }
  }