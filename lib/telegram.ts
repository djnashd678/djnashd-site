const TELEGRAM_TIMEOUT_MS = 10_000;

type TelegramEnvironment = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHANNEL_ID?: string;
};
type FetchImplementation = typeof fetch;

export type TelegramMessage = {
  text: string;
  reply_markup?: {
    inline_keyboard: { text: string; url: string }[][];
  };
};

export class TelegramDeliveryError extends Error {
  constructor(reason: "configuration" | "network" | "response") {
    super(`Telegram delivery failed: ${reason}`);
    this.name = "TelegramDeliveryError";
  }
}

function serverEnvironment(): TelegramEnvironment {
  return {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID
  };
}

export function hasTelegramConfiguration(environment: TelegramEnvironment = serverEnvironment()): boolean {
  return Boolean(environment.TELEGRAM_BOT_TOKEN?.trim() && environment.TELEGRAM_CHANNEL_ID?.trim());
}

export async function sendTelegramChannelMessage(
  message: TelegramMessage,
  fetchImplementation: FetchImplementation = fetch,
  environment: TelegramEnvironment = serverEnvironment()
): Promise<void> {
  const token = environment.TELEGRAM_BOT_TOKEN?.trim();
  const channelId = environment.TELEGRAM_CHANNEL_ID?.trim();
  if (!token || !channelId) throw new TelegramDeliveryError("configuration");

  let response: Response;
  try {
    response = await fetchImplementation(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text: message.text,
        parse_mode: "HTML",
        reply_markup: message.reply_markup
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS)
    });
  } catch {
    throw new TelegramDeliveryError("network");
  }

  if (!response.ok) throw new TelegramDeliveryError("response");
}
