const fs = require('fs');
const athena = require('athena-client');
const forecastQuery = require('./queries/forecastQuery.js')

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


const forecastQuery = forecastQuery.getQuery();

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


 