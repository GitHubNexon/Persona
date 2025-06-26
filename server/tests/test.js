require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log("Token:", process.env.REPLICATE_API_TOKEN);

const input = {
  top_k: 0,
  top_p: 0.95,
  prompt:
    "Johnny has 8 billion parameters. His friend Tommy has 70 billion parameters. What does this mean when it comes to speed?",
  max_tokens: 512,
  temperature: 0.7,
  system_prompt: "You are a helpful assistant",
  length_penalty: 1,
  max_new_tokens: 512,
  stop_sequences: "<|end_of_text|>,<|eot_id|>",
  prompt_template:
    "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
  presence_penalty: 0,
  log_performance_metrics: false,
};

async function run() {
  try {
    for await (const event of replicate.stream(
      "meta/meta-llama-3-8b-instruct",
      {
        input,
      }
    )) {
      process.stdout.write(event.toString());
    }
  } catch (error) {
    console.error("Error during streaming:", error);
  }
}

run();
