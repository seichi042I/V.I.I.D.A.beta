const chatLog = document.getElementById("chatLog");
const userInput = document.getElementById("userInput");
var userPrompt = ""
const responses = [
    "そうですね。",
    "了解しました。",
    "面白いですね、トニー様。",
    "その問題について調べてみます。",
    "新しい情報を提供します。",
    "おっしゃる通りです。",
    "まったくもってその通りです。",
    "理解しました。",
];

// ユーザの音声入力を受け取るためのSpeechRecognitionオブジェクトを作成
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

recognition.interimResults = true; // 一時的な結果も取得できるように設定
recognition.lang = 'ja-JP'; // 日本語の音声認識を使用

recognition.onresult = (event) => {
    const userMessage = event.results[0][0].transcript;
    userInput.value = userMessage;
    console.log("a")
};

// 音声認識が終了したタイミングでテキストを自動的に送信
recognition.onend = () => {
    const userMessage = userInput.value.trim();
    if (userMessage !== "") {
        appendMessage("user", userMessage);
        userPrompt = userInput.value;
        userInput.value = "";
        setTimeout(sendBotResponse, 500);
    }
};

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== "") {
        appendMessage("user", userMessage);
        userPrompt = userInput.value;
        userInput.value = "";
        setTimeout(sendBotResponse, 500);
    }
}

function sendBotResponse() {
    const randomIndex = Math.floor(Math.random() * responses.length);
    const response = responses[randomIndex];
    appendMessage("bot", response);
}

function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender === "user" ? "user" : "chat-bot");
    messageDiv.innerText = sender === "user" ? "user：" + message : "V.I.I.D.A.：";
    reply(messageDiv)
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// マイクボタンを押したときに音声認識を開始する
micButton.addEventListener('click', () => {
    recognition.start();
});

// chatGPT
const API_KEY = 'xxx';
const URL = "https://api.openai.com/v1/chat/completions";

function reply(messageDiv) {
    async function getResponse() {
        if (userPrompt !== ""){
            try {
                console.log(userPrompt)
                const response = await axios.post(
                    URL,
                    {
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            { "role": "user", "content": userPrompt}
                        ]
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }
                );
                var chatgpt_response = response.data.choices[0].message.content;
                // $("#response_text").val(chatgpt_response);
                messageDiv.innerText = "J.A.R.V.I.S.："+chatgpt_response;
                console.log(chatgpt_response)
                userPrompt = ""
            } catch (error) {
                console.log(error);
            }
        }
    }
    getResponse();

}
