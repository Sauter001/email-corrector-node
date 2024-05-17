require("dotenv").config();
const OpenAIApi = require("openai");
const fs = require("fs");

const openai = new OpenAIApi({
  api_key: "process.env.OPENAI_API_KEY",
});

const gen_content_inst = fs.readFileSync("gen_prompt.md").toString();

async function generateMail(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: gen_content_inst,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.95,
      max_tokens: 1024,
    });

    // 모델의 응답에서 답변 가져오기
    const answer = response.choices[0].message.content;
    // console.log("ChatGPT 답변:", answer);

    return answer;
  } catch (error) {
    console.error("ChatGPT 요청 중 오류:", error);
    throw error;
  }
}

module.exports = { generateMail };
