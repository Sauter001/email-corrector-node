const express = require("express");
const app = express();
const PORT = 3000;

let { generateMail, correctEmail } = require("./email-gpt");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Hello Node.js!<h1/>");
});

/**
 * 이메일 생성 요청하는 post 처리 부분
 * @param purpose: 이메일 작성 목적
 */
app.post("/createEmail", async (req, res) => {
  const { receiver, purpose } = req.body;

  try {
    const title_reg = new RegExp(/##\s*([^\r\n]+)([\s\S]*)/); // 이메일의 제목 추출위한 정규표현식
    const result = await generateMail(receiver, purpose); // await 키워드로 비동기 함수 호출

    // 생성 결과에서 제목과 본문 추출
    const matches = result.match(title_reg);
    const title = matches[1];
    const body = matches[2].trim();

    res.json({ ok: true, title: title, emailBody: body }); // 결과가 준비된 후 응답 전송
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error: "Failed to generate email" }); // 오류 처리
  }
});

/**
 * 이메일 교정 기능 POST 요청
 * @param {string} tone - 이메일의 말투 수준
 * @param {number} quantity - 이메일의 분량
 * @param {string} expression - 이메일의 표현 수준
 * @param {boolean} spelling - 맞춤법 및 철자 검사 여부
 * @param {string} mood - 이메일의 분위기
 * @param {string} emailBody - 교정된 이메일 본문
 */
app.post("/correctEmail", async (req, res) => {
  const { tone, quantity, expression, spelling, mood, emailBody } = req.body;

  try {
    const result = await correctEmail(req.body);
    res.json({ ok: true, correctedBody: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error: "Failed to correct email" }); // 오류 처리
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
