import { AI_KNOWLEDGE } from "../ai/knowledge";
import { AI_SYSTEM_PROMPT } from "../ai/system-prompt";
import { logger } from "./logger";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export type DeepseekChatResult =
  | { ok: true; answer: string }
  | { ok: false; reason: "missing_key" | "upstream" | "empty" };

function getModel(): string {
  return process.env["DEEPSEEK_MODEL"]?.trim() || "deepseek-flash";
}

export async function askDeepseek(params: {
  question: string;
  path?: string;
}): Promise<DeepseekChatResult> {
  const apiKey = process.env["DEEPSEEK_API_KEY"]?.trim();
  if (!apiKey) {
    return { ok: false, reason: "missing_key" };
  }

  const pathLine = params.path
    ? `Текущая страница сайта пользователя: ${params.path}`
    : "Страница сайта не указана.";

  const system = `${AI_SYSTEM_PROMPT}\n\n--- База знаний ---\n${AI_KNOWLEDGE}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModel(),
        temperature: 0.35,
        max_tokens: 900,
        // Flash по умолчанию думает; для сайт-ассистента нужен быстрый ответ
        thinking: { type: "disabled" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `${pathLine}\n\nВопрос пользователя:\n${params.question}`,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      logger.warn(
        { status: response.status, body: body.slice(0, 400) },
        "DeepSeek request failed",
      );
      return { ok: false, reason: "upstream" };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) return { ok: false, reason: "empty" };
    return { ok: true, answer };
  } catch (err) {
    logger.warn({ err }, "DeepSeek request error");
    return { ok: false, reason: "upstream" };
  } finally {
    clearTimeout(timeout);
  }
}
