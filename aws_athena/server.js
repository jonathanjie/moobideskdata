const fs = require('fs');
const athena = require('athena-client');
const queries = require('./queries.js')

const awsConfig  = JSON.parse(fs.readFileSync('./config.json'));
const clientConfig = {
  bucketUri: 's3://athena-software-query-results',
  database: 'scrio_data'
}

const client = athena.createClient(clientConfig, awsConfig);


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

client.execute(forecastQuery).toPromise()
.then(data => {
  fs.writeFileSync('forecastQueryLogs.json', JSON.stringify(data));
  console.log('forecast query successful!');
  console.log(data.queryExecution.ResultConfiguration.OutputLocation);
})
.catch(err => console.log(err));

client.execute(recommendationQuery).toPromise()
.then(result => {
  fs.writeFileSync('recommendationQueryLogs.json', JSON.stringify(result));
  console.log("recommendation query successful")
  console.log(result.queryExecution.ResultConfiguration.OutputLocation);
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


 