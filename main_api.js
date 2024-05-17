const express = require("express");
const app = express();
const PORT = 3000;

let { generateMail } = require("./email-gpt");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Hello Node.js!<h1/>");
});

app.post("/createEmail", async (req, res) => {
  const { purpose } = req.body;

  try {
    const title_reg = new RegExp(/##\s*([^\r\n]+)/);
    const result = await generateMail(purpose); // await 키워드로 비동기 함수 호출
    console.log(result.match(title_reg));
    const title = result.match(title_reg)[1];

    res.json({ ok: true, title: title, emailBody: result }); // 결과가 준비된 후 응답 전송
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error: "Failed to generate email" }); // 오류 처리
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
