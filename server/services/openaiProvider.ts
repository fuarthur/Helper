import fetch from 'node-fetch';

type CompletionResponse = { text: string };

export class OpenAIProvider {
  private apiKey = process.env.OPENAI_API_KEY || '';
  private model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  async complete(prompt: string): Promise<CompletionResponse> {
    if (!this.apiKey) {
      return { text: `Mock completion for prompt: ${prompt}` };
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      }),
    });
    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || '' };
  }
}
