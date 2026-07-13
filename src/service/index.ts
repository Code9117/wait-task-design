import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import type { ChatCompletion } from "openai/resources";
import { systemPrompt, renderUserPrompt, executionSystemPrompt, renderExecutionUserPrompt } from "./prompt";

export interface ModelConfig {
  apiKey: string;
  model: string;
}

export const SUPPORTED_MODELS = [
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro" },
];

export const MAX_FREE_CALLS = parseInt(process.env.NEXT_PUBLIC_MAX_FREE_CALLS || "5");
export const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_DEFAULT_API_KEY || "";

let openaiClient: OpenAI | null = null;

export function initOpenAIClient(config: ModelConfig): OpenAI {
  openaiClient = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
  });
  return openaiClient;
}

export function getOpenAIClient(): OpenAI | null {
  return openaiClient;
}

function getCallCount(): number {
  if (typeof window === "undefined") return 0;
  const count = localStorage.getItem("ai_call_count");
  return count ? parseInt(count, 10) : 0;
}

function incrementCallCount(): number {
  if (typeof window === "undefined") return 0;
  const current = getCallCount();
  const next = current + 1;
  localStorage.setItem("ai_call_count", next.toString());
  return next;
}

export function getRemainingCalls(): number {
  return Math.max(0, MAX_FREE_CALLS - getCallCount());
}

export function isFreeQuotaExceeded(): boolean {
  return getCallCount() >= MAX_FREE_CALLS;
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
  const response = await getAIResponse(client, [
    { role: "system", content: systemPrompt },
    { role: "user", content: renderUserPrompt(taskTitle) },
  ]);

  incrementCallCount();

  const result = response?.trim().toLowerCase() || "normal";
  if (result === "urgent") return "urgent";
  if (result === "medium") return "medium";
  return "normal";
}

export async function executeTask(
  client: OpenAI,
  taskTitle: string
): Promise<string> {
  const response = await getAIResponse(client, [
    { role: "system", content: executionSystemPrompt },
    { role: "user", content: renderExecutionUserPrompt(taskTitle) },
  ]);

  incrementCallCount();

  return response?.trim() || "任务执行完成，但未返回具体结果。";
}