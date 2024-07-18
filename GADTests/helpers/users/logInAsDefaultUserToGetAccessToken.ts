import { v4 as UUID4 } from 'uuid';
import { createDefaultUser } from './createDefaultUser';

export async function logInAsDefaultUserToGetAccessToken(request) {
  const email = `test-${UUID4()}@example.com`;
  await createDefaultUser(request, email);

  const getUserByEmail = await request.get(`api/users?email=${email}`);
  const body = await getUserByEmail.json();
  if (body.length > 0) {
    const loginToGetAccessToken = await request.post('api/login', {
      data: { email: email, password: 'testPassword' },
    });
    const loginBody = await loginToGetAccessToken.json();
    const accessToken = loginBody.access_token;
    return accessToken;
  } else {
    console.log('Could not return access token');
  }
}
