// const fs = require("fs");
import axios from "axios";

const engineId = "stable-diffusion-v1-5";
const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;

if (!apiKey) throw new Error("Missing Stability API key.");

export async function stability() {
  console.log("Running stability test for text-to-image");

  const response = await axios.post(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      text_prompts: [
        {
          text: "A cat on a cliff",
        },
      ],
      cfg_scale: 7,
      clip_guidance_preset: "FAST_BLUE",
      height: 512,
      width: 512,
      samples: 1,
      steps: 30,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Non-200 response: ${response.data}`);
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string;
      seed: number;
      finishReason: string;
    }>;
  }

  const responseJSON = response.data as GenerationResponse;
  // console.log("responseJSON", responseJSON.artifacts[0].base64);
  const theBase = responseJSON.artifacts[0].base64;

  const url = `data:image/png;base64,${theBase}`;
  const img = document.createElement("img");
  img.src = url;
  sessionStorage.setItem("debaser", img.src);

  //   responseJSON.artifacts.forEach((image, index) => {
  //     fs.writeFileSync(
  //       `./stability-images/v1_txt2img_${index}.png`,
  //       Buffer.from(image.base64, "base64")
  //     );
  //   });
  responseJSON.artifacts.forEach((image, index) => {
    const url = `data:image/png;base64,${image.base64}`;
    // sessionStorage.setItem(`v1_txt2img_${index}.png`, url);
    sessionStorage.setItem(`v1_txt2img_0.png`, url);
    const img = document.createElement("img");
    img.src = url;
  });
}
