import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3004/');
  await page.getByRole('link', { name: 'Dapp' }).click();
  await page.getByRole('link', { name: 'asyncTest' }).click();
  await page.getByRole('button', { name: '错误更新（不会重新渲染）' }).click();
  await page.getByRole('button', { name: '正确更新' }).click();
  await page.getByRole('button', { name: '错误更新（不会重新渲染）' }).click();
  await expect(page.getByRole('main')).toContainText('姓名: John');
  await page.getByRole('button', { name: '错误更新（不会重新渲染）' }).click();
  await expect(page.getByRole('main')).toContainText('姓名: John');
  await page.getByRole('link', { name: 'Dapp' }).click();
  await page.getByRole('button', { name: '连接钱包' }).click();
  await page.getByRole('combobox').selectOption('11155111');
});
