import "server-only";
import { handleManualTelegramPostRequest } from "@/lib/telegram-post";
import { hasTelegramConfiguration, sendTelegramChannelMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request): Promise<Response> {
  return handleManualTelegramPostRequest(request, {
    cronSecret: process.env.CRON_SECRET,
    telegramConfigured: hasTelegramConfiguration(),
    deliver: sendTelegramChannelMessage,
    logError: (status) => console.error(`[telegram-post] ${status}`)
  });
}
