const OpenAI = require("openai");

module.exports = class GPT {
  constructor({ apiKey, model }) {
    this.apiKey = apiKey;
    this.model = model;
    this.temperature = 0.7;
    // const configuration = new Configuration({
    //   apiKey,
    // });
    this.openai = new OpenAI();
  }

  async getArticle({ title, numOfPoints, tone }) {
    if (!title) throw `Title must be provided`;

    numOfPoints = numOfPoints || 0;
    if (numOfPoints)
      numOfPoints = `,should discuss ${numOfPoints} unique points`;

    tone = tone || "casual and informative";

    if (tone) tone = `, using ${tone} tone`;

    let prompt = `Write an blog post about "${title}"${numOfPoints}${tone}. Please do not include the title text itself that I have provided.`;

    return this.getResponse(prompt);
  }

  async getResponse(prompt) {
    try {
      // Send a request to the OpenAI API to generate text
      // const response = await openai.chat.completions.create({
      //     model:this.model,
      //     prompt,
      //     n: 1,
      //     temperature:this.temperature,
      // });

      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        model: this.model,
        n: 1,
        temperature: this.temperature,
      });

      console.log("completion.choices[0].message:",completion.choices[0].message)
      // console.log(`request cost: ${response.data.usage.total_tokens} tokens`);
      // Return the text of the response
      return completion.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }
};
