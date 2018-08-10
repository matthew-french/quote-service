const dateFormat = require('date-fns/format');
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const db = require('./db.js');
const model = require('./model.js');

AWS.config.update({
  region: 'eu-west-1',
  endpoint: 'http://localhost:8000',
  accessKey: 'a',
  secretKey: 'a',
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();


db.connect();

const cats = [
  'Sayings and Quotes',
  'TV and Film',
  'Music',
  'Video Games',
  'Books',
  'Theatre',
  'Poetry',
];

const handler = async () => {
  const getItem = (current, next) => {
    const item = AWS.DynamoDB.Converter.marshall({
      quote: next.phrase,
      language_category: `${next.language.toLowerCase()} ${cats[next.category].toLowerCase()}`.replace(/ /g, '_'),
      language: next.language.toLowerCase(),
      category_id: next.category,
      category: cats[next.category],
      game_id: next.games_id,
      id: next.id,
      uuid: uuid(),
      last_modified: dateFormat(Date.now()),
    });

    current.push({
      PutRequest: {
        Item: item,
      },
    });
    return current;
  };

  const rows = await model.getAllRows();
  const items = await rows.reduce(getItem, []);

  const chunkArray = (array, chunkSize) => Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize),
  );

  const chunk = chunkArray(items, 25);

  const getParams = (i) => {
    const params = {
      RequestItems: {
        quotes: i,
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
    };
    return params;
  };

  const process = async (batch) => {
    const params = getParams(batch);

    const results = dynamodb.batchWriteItem(params, (err) => {
      if (err) return err;
      console.log('success');
      console.log(params);
      return 'success';
    });

    try {
      return results;
    } catch (error) {
      console.log(results);
    }
  };


  return chunk.forEach(currentBatch => process(currentBatch));
};

handler();
