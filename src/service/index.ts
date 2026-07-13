import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import type { ChatCompletion } from "openai/resources";

export interface ModelConfig {
  apiKey: string;
  model: string;
}

export const SUPPORTED_MODELS = [
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro" },
];

let openaiClient: OpenAI | null = null;

export function initOpenAIClient(config: ModelConfig): OpenAI {
  openaiClient = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: config.apiKey,
  });
  return openaiClient;
}

export function getOpenAIClient(): OpenAI | null {
  return openaiClient;
}

interface DeepSeekChatCompletionParams {
  messages: ChatCompletionMessageParam[];
  model: string;
  thinking?: { type: "enabled" | "disabled" };
  reasoning_effort?: "low" | "medium" | "high";
  stream?: boolean;
}

export async function getAIResponse(
  client: OpenAI,
  messages: ChatCompletionMessageParam[],
  model: string = "deepseek-v4-pro"
): Promise<string | null | undefined> {
  const completion = await client.chat.completions.create({
    messages,
    model,
    thinking: { type: "enabled" },
    reasoning_effort: "high",
    stream: false,
  } as DeepSeekChatCompletionParams) as ChatCompletion;

  return completion.choices[0].message.content;
}

export async function analyzeTaskPriority(
  client: OpenAI,
  taskTitle: string
): Promise<"urgent" | "medium" | "normal"> {
  const systemPrompt = `你是一个任务优先级分析助手。请根据任务标题判断其优先级：
- urgent（紧急）：需要立即处理的重要任务
- medium（中等）：需要在近期处理的任务
- normal（普通）：常规任务，可稍后处理

请直接返回优先级关键词，不要包含其他内容。`;

  const response = await getAIResponse(client, [
    { role: "system", content: systemPrompt },
    { role: "user", content: `请分析以下任务的优先级：${taskTitle}` },
  ]);

  const result = response?.trim().toLowerCase() || "normal";
  if (result === "urgent") return "urgent";
  if (result === "medium") return "medium";
  return "normal";
}