const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const welcomeChannelName = "안녕하살법";
const byeChannelName = "안녕하살법받아치기";
const welcomeChannelComment = "어서오세요.";
const byeChannelComment = "님이 퇴교 하셨습니다.";

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '감시' }, status: 'online' })
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "일반인ㅋ"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == '입수') {
    return message.reply('머리부터 발끝 까지!');
  }

  if(message.content == '야') {
    return message.reply('누가 반말해 너 인성 문제 있어?');
  }

  if(message.content == '하') {
    return message.reply('너 양치 안했어? 말하지마 입냄새나니까');
  }
  
  if(message.content == '아니요') {
    return message.reply('누가 말대꾸 하래?');
  }
  
  if(message.content == 'ㅋㅋㅋ') {
    return message.reply('웃지마!');
  }
  
  if(message.content == '혼자 게임해야지') {
    return message.reply('넌 이기적이야 넌 독신주의야');
  }
  
  if(message.content == '싫어요') {
    return message.reply('싫어?');
  }
  
  if(message.content == '알겠습니다') {
    return message.reply('누가 알겠습니다로 대답해 모든 대답은 악으로 끝난다!');
  }

  if(message.content == '네') {
    return message.reply('누가 네로 대답해 모든 대답은 악으로 끝난다!');
  }

  if(message.content == '상태확인') {
    let img = 'https://cdn.discordapp.com/attachments/739384252592029712/739459154892161104/unnamed.jpg';
    let embed = new Discord.RichEmbed()
      .setTitle('인성봇 상태')
      .setURL('https://cdn.discordapp.com/attachments/739384252592029712/739459154892161104/unnamed.jpg')
      .setAuthor('인성봇', img, 'https://cdn.discordapp.com/attachments/739384252592029712/739459154892161104/unnamed.jpg')
      .setThumbnail(img)
      .addBlankField()
      .addField('성능', '좋음')
      .addField('연결속도', '보통', true)
      .addField('인성', '매우 나쁨', true)
      .addField('시간', '기능 없음', true)
      .addField('날씨', 'https://www.shorturl.at/owLRZ')
      .addBlankField()
      .setTimestamp()
      .setFooter('환희가 만듬', img)

    message.channel.send(embed)
  } else if(message.content == 'help') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: 'ping', desc: '현재 핑 상태'},
      {name: 'embed', desc: 'embed 예제1'},
      {name: 'embed2', desc: 'embed 예제2 (help)'},
      {name: '!전체공지', desc: 'dm으로 전체 공지 보내기'},
      {name: '!청소', desc: '텍스트 지움'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('Help of 콜라곰 BOT', helpImg)
      .setColor('#186de6')
      .setFooter(`콜라곰 BOT ❤️`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  }

  if(message.content.startsWith('!공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }

  if(message.content.startsWith('!청소')) {
    if(checkPermission(message)) return

    var clearLine = message.content.slice('!청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        const _limit = 10;
        let _cnt = 0;

        message.channel.fetchMessages({limit: _limit}).then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);