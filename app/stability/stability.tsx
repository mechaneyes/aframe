const engineId = "stable-diffusion-xl-beta-v2-2-2";
const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;

if (!apiKey) throw new Error("Missing Stability API key.");

export async function stability(image_prompt: string) {
  console.log("image_prompt:", image_prompt);

  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: image_prompt,
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: "FAST_BLUE",
        height: 320,
        width: 512,
        samples: 1,
        steps: 30,
      }),
    }
  );

  if (response.status !== 200) {
    throw new Error(`non-200 response: ${response.status}`);
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string;
      seed: number;
      finishReason: string;
    }>;
  }

  const responseJSON = (await response.json()) as GenerationResponse;
  const theBase = responseJSON.artifacts[0].base64;
  const url = `data:image/png;base64,${theBase}`;
  const stabilityImg = document.querySelector(".stability-image");

  if (stabilityImg) {
    if (url) {
      stabilityImg.setAttribute("src", url);
      stabilityImg.setAttribute("style", "display: block;");
    }
  }
}
