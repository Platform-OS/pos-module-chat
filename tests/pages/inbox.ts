import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class InboxPage extends BasePage {
    readonly chatRoom: (text: string) => Locator;
    readonly message: (text: string) => Locator;
    readonly messageInputField: Locator;

  constructor(page: Page) {
    super(page, '/inbox');
    this.chatRoom = (text) => page.locator('[data-tc="chat-room"]').filter( {hasText:text});
    this.message = (text) => page.locator('#chat-messagesList').getByText(text, { exact: true });
    this.messageInputField = page.locator('#chat-messageInput');
  };
}
