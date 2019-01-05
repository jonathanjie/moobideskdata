const fs = require('fs');
const athena = require('athena-client');

const awsConfig  = JSON.parse(fs.readFileSync('./config.json'));
const clientConfig = {
  bucketUri: 's3://athena-software-query-results',
  database: 'scrio_upload'
}

const client = athena.createClient(clientConfig, awsConfig);

const athenaForecastQuery = `SELECT year(conversation_createdat) AS year, month(conversation_createdat) AS month,
day(conversation_createdat) AS day,
hour(conversation_createdat) AS hour,
channel, COUNT(DISTINCT conversation__id) AS "numConvo",
AVG(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook', date_diff('minute', conversation_createdat, conversation_lastmessagets), NULL)) AS textAvgMins,
AVG(IF(channel = 'Email', date_diff('minute', conversation_createdat, conversation_lastmessagets), NULL)) AS emailAvgMins
FROM "scrio_upload"."moobilogs" 
GROUP BY year(conversation_createdat), month(conversation_createdat), day(conversation_createdat), hour(conversation_createdat), 
channel
ORDER BY year(conversation_createdat), month(conversation_createdat), day(conversation_createdat), hour(conversation_createdat);`

// channel-type.name = Voice?
const forecastQuery = `
WITH chatConversations AS (
  SELECT chat.conversation AS conversation_id,
  year(chat.createdAt) AS year, 
  month(chat.createdAt) AS month,
  day(chat.createdAt) AS day,
  hour(chat.createdAt) AS hour,
  COUNT(chat.conversation) AS numChats

  FROM (chat INNER JOIN conversation ON chat.conversation = conversation.uuid)
  
  GROUP BY year(conversation.createdAt) AS year, 
  month(conversation.createdAt) AS month,
  day(conversation.createdAt) AS day,
  hour(conversation.createdAt) AS hour,
  conversation.uuid
)

SELECT 
year(CONVO.createdAt) AS year, month(CONVO.createdAt) AS month,
day(CONVO.createdAt) AS day,
hour(CONVO.createdAt) AS hour,
COUNT(DISTINCT CONVO.uuid) AS "numConvo",

-- numConvo
COUNT (IF(channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook', 1, NULL)) AS chatNumConvos,
COUNT (IF(channel-type.name = 'Email', 1, NULL)) AS emailNumConvos,
COUNT (IF(channel-type.name = 'Voice', 1, NULL)) AS voiceNumConvos,

-- avrConvoDuration
AVG(IF(channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS textAvgMins
AVG(IF(channel-type.name = 'Email', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS emailAvgMins,
AVG(IF(channel-type.name = 'Voice', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS voiceAvgMins,

-- avrNumChatsPerConvo
AVG(IF(channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook', CHATSCONVERSATION.numChats, NULL)) AS textAvgChatsPerConvo
AVG(IF(channel-type.name = 'Email', CHATSCONVERSATION.numChats, NULL)) AS emailAvgChatsPerConvo,

-- numDispositions
-- disposition types: dispo1, dispo2, dispo3
-- chats
COUNT(IF((channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook') AND DISPOSITION.name = 'dispo1', 1, NULL)),
COUNT(IF((channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook') AND DISPOSITION.name = 'dispo2', 1, NULL)),
COUNT(IF((channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook') AND DISPOSITION.name = 'dispo3', 1, NULL)),
-- email
COUNT(IF(channel-type.name = 'Email' AND DISPOSITION.name = 'dispo1', 1, NULL)),
COUNT(IF(channel-type.name = 'Email' AND DISPOSITION.name = 'dispo2', 1, NULL)),
COUNT(IF(channel-type.name = 'Email' AND DISPOSITION.name = 'dispo3', 1, NULL)),
-- voice 
COUNT(IF(channel-type.name = 'Voice' AND DISPOSITION.name = 'dispo1', 1, NULL)),
COUNT(IF(channel-type.name = 'Voice' AND DISPOSITION.name = 'dispo2', 1, NULL)),
COUNT(IF(channel-type.name = 'Voice' AND DISPOSITION.name = 'dispo3', 1, NULL))


FROM (conversation AS CONVO 
  INNER JOIN channel-type ON CONVO.lastMessageChannelType = channel-type.uuid 
  INNER JOIN CHATSCONVERSATION AS CHATSCONVERSATION ON CONVO.uuid = CHATSCONVERSATION.conversation_id
  INNER JOIN disposition AS DISPOSITION ON CONVO.disposition = DISPOSITION.key) 

GROUP BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt)
ORDER BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt);`

const recommendationQuery = `SELECT year(chat.conversationcreatedAt) AS year, month(chat.conversationcreatedAt) AS month,
day(chat.conversationcreatedAt) AS day,
hour(chat.conversationcreatedAt) AS hour,
COUNT(DISTINCT chat.agents) AS numAgents,
COUNT(IF(abandoned = false, 1, NULL)) AS numConvosHandled,
COUNT(IF(isSlaSuccess = true, 1, NULL))/COUNT(DISTINCT chat.conversation) as percentSla
FROM (chat INNER JOIN conversation-sla-log.js ON chat.conversation = conversation-sla-log.conversation)
GROUP BY year(chat.conversationcreatedAt), month(chat.conversationcreatedAt), day(chat.conversationcreatedAt), hour(chat.conversationcreatedAt)
ORDER BY year(chat.conversationcreatedAt), month(chat.conversationcreatedAt), day(chat.conversationcreatedAt), hour(chat.conversationcreatedAt);` 

client.execute(athenaForecastQuery).toPromise()
.then(data => {
  fs.writeFileSync('logs.txt', JSON.stringify(data));
  console.log('execution successful!')
})
.catch(err => console.log(err));


  /**
   * PER HOUR
   * 
   * Forecast
  1) numConvo [done]
    - Chats
    - Email
    - Voice
  2) numConcurrent ??????????????????????????
    - Chats
    - Email
    - Voice
  3) avrConvoDuration [done]
    - Chats
    - Email
    - Voice

  4) avrNumChatsPerConvo [done]
    - Chats
    - Email

  5) dispositionCount(s) [done]
    - Chats
    - Email 
    - Voice


  Recommendation
  6) numAgents
    - for each channel combi (voice, chat, email – 7 combi)
  7) numConvosHandled
    - for each channel combi
  8) percentageMetSLA
    - for each channel 
  */



// var AWS = require('aws-sdk');

// AWS.config.loadFromPath('./config.json');

// const athena = new AWS.Athena({
//   apiVersion: '2017-05-18'
// });

// const params = {
//   Database: 'scrio_upload',
//   Name: 'readQuery',
//   QueryString: 'SELECT * FROM "scrio_upload"."moobilogs"',
//   Description: "Testing purposes"
// }

// athena.startQueryExecution(params, (err, data) => {
//   if (err) console.log(err, err.stack);
//   else     console.log(data);
// });


 