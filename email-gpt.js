require("dotenv").config();
const OpenAIApi = require("openai"); // openAI 모듈
const fs = require("fs");

const openai = new OpenAIApi({
  api_key: "process.env.OPENAI_API_KEY",
});

/**
 * 주어진 프롬프트를 기반으로 이메일을 생성하는 비동기 함수
 * @param {string} receiver - 송신자
 * @param {string} user_prompt - 사용자 프롬프트
 * @returns {Promise<string>} - 생성된 이메일 내용
 */
async function generateMail(receiver, user_prompt) {
  // GPT의 instruction을 불러오기 위해 'gen_user_prompt.md' 파일의 내용을 읽어 문자열로 변환
  const gen_content_inst = fs.readFileSync("gen_prompt.md").toString();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // OpenAI의 GPT-3.5-turbo 모델에 요청 보냄.
      messages: [
        {
          role: "system",
          content: gen_content_inst,
        },
        {
          role: "user",
          content: `send to the email ${receiver} and the purpose is ${user_prompt}`,
        }, // 사용자 메시지로 프롬프트를 설정
      ],
      temperature: 0.95, // 메일 내용의 다양성 조절하는 온도
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

async function correctEmail(content_for_correct) {
  const correct_content_inst = fs
    .readFileSync("correction_prompt.md")
    .toString();
  slider_desc = JSON.parse(fs.readFileSync("slider_description.json"));
  const { tone, quantity, expression, spelling, mood, emailBody } =
    content_for_correct;

  const option_list = [];

  const mood_types = ["감정 없음", "축하", "유감"];
  const spelling_prompt =
    "오타, 띄어쓰기, 문장 부호 중 다음에 해당 하는 부분만 교정하세요: " +
    spelling.join(", ") +
    "\n";

  option_list.push(makeCorrectOption(slider_desc, "tone", tone)); // tone 설정
  option_list.push(makeCorrectOption(slider_desc, "quantity", quantity));
  option_list.push(makeCorrectOption(slider_desc, "expression", expression));
  option_list.push(spelling_prompt);
  option_list.push(`이메일의 mood는 ${mood_types[mood]}의 분위기로 하십시오`);

  let whole_assistant_prompt = option_list.join("\n");
  console.log(whole_assistant_prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // OpenAI의 GPT-3.5-turbo 모델에 요청 보냄.
      messages: [
        {
          role: "system",
          content: correct_content_inst + "\n" + whole_assistant_prompt,
        },
        { role: "user", content: emailBody }, // 사용자 메시지로 프롬프트를 설정
      ],
      temperature: 0.95, // 메일 내용의 다양성 조절하는 온도
      max_tokens: 2048, // 응답에서 사용할 최대 토큰 수}
    });

    // 모델의 응답에서 첫 답변 가져오기
    const answer = response.choices[0].message.content;

    return answer; // 교정된 이메일 내용 반환
  } catch (error) {
    console.error("ChatGPT 요청 중 오류:", error);
    throw error;
  }
}

const makeCorrectOption = (slider_desc, attr, deg_of_attr) => {
  return (
    `[${slider_desc[attr][deg_of_attr].level}]\n` +
    slider_desc[attr][deg_of_attr].description +
    " example:\n" +
    slider_desc[attr][deg_of_attr].example +
    "\n--------------\n"
  );
};

module.exports = { generateMail, correctEmail }; // generateMail 함수를 모듈로 내보내기
