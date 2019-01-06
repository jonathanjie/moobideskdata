const fs = require('fs');
const athena = require('athena-client');
const queries = require('./queries.js')

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
  6) numAgents [done]
    - for each channel combi (voice, chat, email – 7 combi)

  7) numConvosHandled [done]
    - for each channel combi (voice, chat, email – 7 combi)

  8) percentageMetSLA [done]
    - for each channel (no combi?)
  */


const forecastQuery = queries.getForecastQuery();
const recommendationQuery = queries.getRecommendationQuery();

client.execute(athenaForecastQuery).toPromise()
.then(data => {
  fs.writeFileSync('logs.txt', JSON.stringify(data));
  console.log('execution successful!')
})
.catch(err => console.log(err));


  


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


 