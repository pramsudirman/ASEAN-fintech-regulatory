import OpenAI from 'openai'

// NVIDIA NIM uses OpenAI-compatible API — swap base URL + model names
export const nim = new OpenAI({
  baseURL: process.env.NVIDIA_BASE_URL?.replace('/chat/completions', '') ?? 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY!,
})

export const NIM_MODELS = {
  extraction:     'meta/llama-3.3-70b-instruct',   // complex reasoning, structured output
  classification: 'meta/llama-3.1-8b-instruct',    // fast + cheap for risk classification
  embedding:      'nvidia/nv-embed-v2',             // 4096-dim, SOTA retrieval
} as const
