// Adapter for GitHub Copilot CLI integration
// TODO: Implement when GitHub Copilot CLI is available in the environment.
export class CopilotAdapter {
  async complete(prompt: string) {
    return { text: `Copilot placeholder response for: ${prompt}` };
  }
}
