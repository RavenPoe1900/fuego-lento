export interface ReopeningRepository {
  register(data: { name: string; contact: string }): Promise<void>;
}

/** DEMO · no envía datos a ningún servicio. Conectar un servicio real antes de activar `reopeningSignupEnabled`. */
export const demoReopeningRepository: ReopeningRepository = {
  async register() {
    await new Promise((r) => setTimeout(r, 600));
  },
};
