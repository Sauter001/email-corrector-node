let { callGPT } = require("./email-gpt");

// ChatGPT에 대화식으로 요청 보내기
// postText가 100자 이내로 요약할 전체 내용
const test = async () => {
  let postText = "교수님께 training data를 달라는 내용의 메일 작성";
  let gptContent =
    postText.length > 4000 ? postText.substring(0, 4000) : postText;
  let gptResponse = await callGPT(gptContent);
  if (gptResponse) {
    console.log("chatGPT API 응답: " + gptResponse);
  } else {
    console.log("chatGPT API 응답 실패!");
  }

  if (gptResponse != "") {
    //블로그 API로 ChatGPT API 응답 내용을 meta description에 저장
  }
};

test();
