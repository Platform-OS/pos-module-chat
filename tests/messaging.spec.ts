import { BrowserContext, expect, Page, test } from '@playwright/test';
import { InboxPage } from './pages/inbox';
import { PeoplePage } from './pages/people';
import { switchContext } from './helper';
import { messages } from './data/messages';
import { users } from './data/users';

test.describe('Testing messaging', () => {
  test('user can send message to other users', async ({ browser }) => {
    let context: BrowserContext | null = null;
    let page: Page;

    await test.step(`user 'A' sends message to user 'C' via profile`, async () => {
      ({ context, page } = await switchContext(context, browser, `tests/.auth/${users.test1.email}.json`));
      const inboxPage = new InboxPage(page);
      const peoplePage = new PeoplePage(page);

      await peoplePage.goto();
      await peoplePage.linkWithText(users.test2.fullName).click();
      
      await inboxPage.messageInputField.fill(messages.test1.message1);
      await inboxPage.buttonWithText('Send').click();
      await context.close();
    });

    await test.step(`user 'B' sends message to user 'C'`, async () => {
      ({ context, page } = await switchContext(context, browser, `tests/.auth/${users.test3.email}.json`));
      const inboxPage = new InboxPage(page);
      const peoplePage = new PeoplePage(page);
      
      await peoplePage.goto();
      await peoplePage.linkWithText(users.test2.fullName).click();
      
      await inboxPage.messageInputField.fill(messages.test3.message1);
      await inboxPage.buttonWithText('Send').click();
      await context.close();
    });

    await test.step(`user 'D' sends message to user 'C' via profile`, async () => {
      ({ context, page } = await switchContext(context, browser, `tests/.auth/${users.test4.email}.json`));
      const inboxPage = new InboxPage(page);
      const peoplePage = new PeoplePage(page);
  
      await peoplePage.goto();
      await peoplePage.linkWithText(users.test2.fullName).click();
      
      await inboxPage.messageInputField.fill(messages.test4.message1);
      await inboxPage.buttonWithText('Send').click();
      await context.close();
    }); 

    await test.step(`user 'C' responds to user 'A'`, async () => {
      ({ context, page } = await switchContext(context, browser, `tests/.auth/${users.test2.email}.json`));
      const inboxPage = new InboxPage(page);
  
      await inboxPage.goto();
      await inboxPage.chatRoom(users.test1.fullName).click();
      await expect(inboxPage.message(messages.test1.message1)).toBeVisible();
      await inboxPage.messageInputField.fill(messages.test2.message1);
      await inboxPage.buttonWithText('Send').click();
    });

    await test.step(`user 'C' verify there are 3 chatrooms with expected messages`, async () => {
      const inboxPage = new InboxPage(page);

      const chatRooms = [
        { name: users.test1.fullName, messagesToBeVisible: [messages.test1.message1, messages.test2.message1], messagesNotToBeVisible: [messages.test3.message1, messages.test4.message1] },
        { name: users.test3.fullName, messagesToBeVisible: [messages.test3.message1], messagesNotToBeVisible: [messages.test1.message1, messages.test2.message1, messages.test4.message1] },
        { name: users.test4.fullName, messagesToBeVisible: [messages.test4.message1], messagesNotToBeVisible: [messages.test1.message1, messages.test2.message1, messages.test3.message1] }
      ];

      await inboxPage.goto();

      for (const chatRoom of chatRooms) {
        await expect(inboxPage.chatRoom(chatRoom.name)).toBeVisible();
        await inboxPage.chatRoom(chatRoom.name).click();

        for (const messageToBeVisible of chatRoom.messagesToBeVisible) {
          await expect(inboxPage.message(messageToBeVisible)).toBeVisible();
        };

        for (const messageNotToBeVisible of chatRoom.messagesNotToBeVisible) {
          await expect(inboxPage.message(messageNotToBeVisible)).not.toBeVisible();
        };
      };
    });
  });

  test(`not involved user has empty inbox`, async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/${users.test5.email}.json` });
    const page = await context.newPage();
    const inboxPage = new InboxPage(page);
  
    await inboxPage.goto();
    await expect(inboxPage.chatRoom(users.test1.fullName)).not.toBeVisible();
    await expect(inboxPage.chatRoom(users.test3.fullName)).not.toBeVisible();
    await expect(inboxPage.chatRoom(users.test4.fullName)).not.toBeVisible();
    await expect(inboxPage.elementWithText('You have not started any conversation yet')).toBeVisible();
  });
});