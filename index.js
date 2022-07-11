const axios = require("axios");
const { Client, Intents } = require("discord.js");
const { BOT_TOKEN, prefix, API_KEY } = process.env;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.once("ready", () => {
  console.log("디스코드 봇이 준비되었습니다");
});

const listMsg = `
\`\`\`ansi
[1;34mCOVID-19 발생 지역[0m

[1;33mkey       region[0m
korea      - 전국
daejeon    - 대전
seoul      - 서울
busan      - 부산
daegu      - 대구
incheon    - 인천
gwangju    - 광주
ulsan      - 울산
sejong     - 세종
gyeonggi   - 경기
gangwon    - 강원
chungbuk   - 충북
chungnam   - 충남
jeonbuk    - 전북
jeonnam    - 전남
gyeongbuk  - 경북
gyeongnam  - 경남
jeju       - 제주
quarantine - 검역
\`\`\`
`;

const getData = async () => {
  return await axios
    .get(`https://api.corona-19.kr//korea/country/new/?serviceKey=${API_KEY}`)
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const returnDashboard = (data) => {
  return `
\`\`\`
🟢${data.countryName}
누적 확진자 : ${data.totalCase}
신규 확진자 : ${data.newCase}
발생률 : ${data.percentage}
\`\`\`
  `;
};

client.on("message", async (message) => {
  // message 작성자가 bot이면 return
  if (message.author.bot) return;
  // message 시작이 prefix가 아니면 return
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "list") {
    message.channel.send(listMsg);
    return;
  }
  if (command === "covid") {
    const newData = await getData();

    args.forEach((region) => {
      const regionData = newData[region];

      if (!regionData) {
        message.channel.send(`
\`\`\`ansi
❌[1;31m${region}은 찾을 수 없는 지역입니다[0m
\`\`\`
        `);
      } else {
        message.channel.send(returnDashboard(regionData));
      }
    });
    return;
  }

  if (command === "대전" || command == "dj") {
    const { daejeon } = await getData();

    message.channel.send(returnDashboard(daejeon));
  }
});

client.login(BOT_TOKEN);
