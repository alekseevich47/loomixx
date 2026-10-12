import { Router, type IRouter, type Request } from "express";
import { AiChatBody, AiChatResponse } from "@workspace/api-zod";
import { AI_FALLBACK_ANSWER } from "../ai/knowledge";
import { askDeepseek } from "../lib/deepseek";
import { logger } from "../lib/logger";
import { consumeRateLimit } from "../lib/rate-limit";

const router: IRouter = Router();

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || req.ip || "unknown";
  }
  return req.ip || "unknown";
}

router.post("/ai/chat", async (req, res) => {
  const limited = consumeRateLimit(`ai:${clientKey(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limited.ok) {
    res.status(429).json({
      message: "Слишком много запросов. Подождите немного и попробуйте снова.",
      code: "rate_limited",
    });
    return;
  }

  const parsed = AiChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Некорректный запрос. Проверьте текст вопроса.",
      code: "invalid_body",
    });
    return;
  }

  const { question, path } = parsed.data;
  const result = await askDeepseek({ question, path });

  if (result.ok) {
    const data = AiChatResponse.parse({
      answer: result.answer,
      source: "deepseek",
    });
    res.json(data);
    return;
  }

  logger.info({ reason: result.reason }, "AI chat using fallback");

  // Missing key: soft fallback so local/demo works without DeepSeek.
  if (result.reason === "missing_key") {
    const data = AiChatResponse.parse({
      answer: AI_FALLBACK_ANSWER,
      source: "fallback",
    });
    res.json(data);
    return;
  }

  res.status(503).json({
    message: AI_FALLBACK_ANSWER,
    code: result.reason,
  });
});

export default router;
