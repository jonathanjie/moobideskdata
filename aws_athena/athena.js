const AWS = require('aws-sdk');
const axios = require('axios');

AWS.config.loadFromPath('./config.json');

const athena = new AWS.Athena();
const query = require('./queries.js');

AWS.config.athena = {
    params: {
        bucketUri: 's3://athena-software-query-results',
        database: 'scrio_data'
    }
}

const recommendationQuery = {
    Database: 'scrio_data',
    Name: 'Recommendation Query',
    QueryString: query.getRecommendationQuery()
};

athena.createNamedQuery(recommendationQuery, (err, data) => {
    if (err) console.log(err, err.stack);
    else     console.log(data)
});

const params = {
    QueryString: query.getRecommendationQuery(),
    ResultConfiguration: {
        OutputLocation: 's3://athena-software-query-results/',
    },
    QueryExecutionContext: {
        Database: 'scrio_data'
    }
};

const otherLambdaLink = "https://webhook.site/8a23cec5-ac3c-4213-b9a0-451585bc5dd5";

athena.startQueryExecution(params, (err, data) => { 
    if (err) console.log(err, err.stack); // an error occurred
    else {
        axios.post(otherLambdaLink, {
            fileName: data.QueryExecutionId + ".csv"
        })
        .then(response => console.log(`${data.QueryExecutionId}.csv sent`))
        .catch(err => console.log(err, err.stack));

        console.log(data);           
    }
});
  
