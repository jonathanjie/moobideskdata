const fs = require('fs');
const athena = require('athena-client');

const awsConfig  = JSON.parse(fs.readFileSync('./config.json'));
const clientConfig = {
  bucketUri: 's3://athena-software-query-results',
  database: 'scrio_upload'
}

const client = athena.createClient(clientConfig, awsConfig);

const forecastQuery = `SELECT year(conversation_createdat) AS year, month(conversation_createdat) AS month,
day(conversation_createdat) AS day,
hour(conversation_createdat) AS hour,
channel, COUNT(DISTINCT conversation__id) AS "numConvo",
AVG(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook', date_diff('minute', conversation_createdat, conversation_lastmessagets), NULL)) AS textAvgMins,
AVG(IF(channel = 'Email', date_diff('minute', conversation_createdat, conversation_lastmessagets), NULL)) AS emailAvgMins
FROM "scrio_upload"."moobilogs" 
GROUP BY year(conversation_createdat), month(conversation_createdat), day(conversation_createdat), hour(conversation_createdat), 
channel
ORDER BY year(conversation_createdat), month(conversation_createdat), day(conversation_createdat), hour(conversation_createdat);`

const recommendationQuery = `SELECT ` ;

client.execute(forecastQuery).toPromise()
.then(data => {
  fs.writeFileSync('logs.txt', JSON.stringify(data));
  console.log('execution successful!')
})
.catch(err => console.log(err));



const testForecastQuery = `SELECT year(CONVO.conversationcreatedAt) AS year, month(CONVO.conversationcreatedAt) AS month,
day(CONVO.conversationcreatedAt) AS day,
hour(CONVO.conversationcreatedAt) AS hour,
COUNT(DISTINCT CONVO.uuid) AS "numConvo",
AVG(IF(lastMessageChannelType = 'Telegram' OR lastMessageChannelType = 'SMS' OR lastMessageChannelType = 'Facebook', date_diff('minute', CONVO.conversationcreatedAt, CONVO.closedTime), NULL)) AS textAvgMins
AVG(IF(lastMessageChannelType = 'Email', date_diff('minute', CONVO.conversationcreatedAt, CONVO.closedTime), NULL)) AS emailAvgMins
FROM conversation.js AS CONVO
GROUP BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt)
ORDER BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt);
`


  /**
   * PER HOUR
   * 
   * Forecast
  1) numConvo [done]
    - for each channel
  2) numConcurrent
    - for each channel
  3) avrConvoDuration [done]
    - for each channel
  4) avrNumChats
    - for each text/email channel
  5) dispositionCount(s)
    - for each channel


  Recommendation
  6) numAgents
    - for each channel combi (voice, chat, email – 7 combi)
  7) numConvosHandled
    - for each channel combi
  8) <performance metric> (something to do with % SLA met?)
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


 