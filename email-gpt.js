require("dotenv").config();
const OpenAIApi = require("openai"); // openAI 모듈
const fs = require("fs");

const openai = new OpenAIApi({
  api_key: "process.env.OPENAI_API_KEY",
});

// GPT의 instruction을 불러오기 위해 'gen_user_prompt.md' 파일의 내용을 읽어 문자열로 변환
const gen_content_inst = fs.readFileSync("gen_prompt.md").toString();

/**
 * 주어진 프롬프트를 기반으로 이메일을 생성하는 비동기 함수
 * @param {string} user_prompt - 사용자 프롬프트
 * @returns {Promise<string>} - 생성된 이메일 내용
 */
async function generateMail(user_prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // OpenAI의 GPT-3.5-turbo-16k 모델에 요청 보냄.
      messages: [
        {
          role: "system",
          content: gen_content_inst,
        },
        { role: "user", content: user_prompt }, // 사용자 메시지로 프롬프트를 설정
      ],
      temperature: 0.9, // 메일 내용의 다양성 조절하는 온도
      max_tokens: 2048, // 응답에서 사용할 최대 토큰 수
    });

    // 모델의 응답에서 첫 답변 가져오기
    const answer = response.choices[0].message.content;

    return answer; // 생성된 이메일 내용 반환
  } catch (error) {
    console.error("ChatGPT 요청 중 오류:", error);
    throw error;
  }
}

module.exports = { generateMail }; // generateMail 함수를 모듈로 내보내기
