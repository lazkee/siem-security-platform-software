import { createApp } from "./app";

async function bootstrap(): Promise<void> {
  try {
    const app = await createApp();
    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => {
      console.log(`[Bootstrap] Server running on port ${port}`);
    });
  } catch (err) {
    console.error("[Bootstrap] Fatal startup error", err);

    
  }
}

void bootstrap();
