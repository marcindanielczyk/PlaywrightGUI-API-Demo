import { expect } from 'playwright/test';
import { logInAsDefaultUserToGetAccessToken } from '../users/loginAsDefaultUserToGetAccessToken';

export async function deleteArticle(request, id) {
  const getArticleById = await request.get(`api/articles/${id}`);
  const body = getArticleById.json();

  if (body.length > 0) {
    await logInAsDefaultUserToGetAccessToken(request);
    const deleteArticle = await request.delete(`api/articles/${id}`, {
      headers: { Authorization: `Bearer ${logInAsDefaultUserToGetAccessToken}` },
    });
    expect(deleteArticle.ok()).toBeTruthy();
  }
}
