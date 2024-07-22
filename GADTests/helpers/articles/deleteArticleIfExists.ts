import { expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { logInAsDefaultUserToGetAccessToken } from '../users/loginAsDefaultUserToGetAccessToken';

export async function deleteArticleIfExists(request, id) {
  const getArticleById = await request.get(`api/articles/${id}`);
  const body = getArticleById.json();

  if (body.length > 0) {
    // const email = `test-${UUID4()}@example.com`;
    const loginToGetAccessToken = await request.post('api/login', {
      data: { email: 'Moses.Armstrong@Feest.ca', password: 'test1' },
    });
    const loginBody = await loginToGetAccessToken.json();
    const accessToken = loginBody.access_token;
    console.log('Access Token deleteARTICLE:', accessToken);
    const deleteArticle = await request.delete(`api/articles/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(deleteArticle.ok()).toBeTruthy();
  }
}
