require("dotenv").config();
const OpenAIApi = require("openai");

const openai = new OpenAIApi({
  api_key: "process.env.OPENAI_API_KEY",
});

async function callGPT(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You should now compose your email based on the compose purpose provided. \
                  For example When a user provides an email creation purpose, \
                  send a clean email based on that purpose.\
                Make sure you know who you're sending it to, so that you can change the tone of voice accordingly. \
                You must response in Korean when asked Korean but its sentence must sound natural. Write in detail.",
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

module.exports = { callGPT };
