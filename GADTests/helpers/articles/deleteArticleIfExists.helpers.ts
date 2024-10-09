import { expect } from 'playwright/test';

export async function deleteArticleIfExists(request, id, email, password) {
  const getArticleById = await request.get(`api/articles/${id}`);
  const body = getArticleById.json();

  if (Object.keys(body).length >= 0) {
    const loginToGetAccessToken = await request.post('api/login', {
      data: { email: email, password: password },
    });
    const loginBody = await loginToGetAccessToken.json();
    const accessToken = loginBody.access_token;

    const deleteArticle = await request.delete(`api/articles/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(deleteArticle.ok()).toBeTruthy();
  }
}
