// XXX include simple rate limiter

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uuid = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports.points = async (event, _, callback) => {
  const team = event.pathParameters.team.toLowerCase();

  switch (event.httpMethod) {
    case 'GET': // GET /{team}/points
      let searchParams = {
        Bucket: process.env.S3_BUCKET,
        Prefix: `${team}/`
      };

      try {
        // XXX paginate to be able to deal with more than 1000 points, see "s3-ls" module
        const result = await s3.listObjectsV2(searchParams).promise();
        const points = result.Contents.map(object => {
          const key = object.Key; // XXX assert format $team/$uuid-$x-$y

          return {
            timestamp: object.LastModified.getTime(), // millis
            x: key.split('-')[1],
            y: key.split('-')[2]
          };
        });
        callback(null, buildSuccessBody(points));
      } catch (err) {
        callback(null, buildErrorBody(err));
      }

      break;
    case 'POST': // POST /{team}/points
      let point = JSON.parse(event.body);

      let pid = `${uuid()}-${point.x}-${point.y}`;

      let createParams = {
        Body: '', // empty, we use the file name (key) to store all the info we need
        Bucket: process.env.S3_BUCKET,
        Key: `${team}/${pid}`
      };

      try {
        await s3.putObject(createParams).promise();
        callback(null, buildSuccessBody({pid: pid}));
      } catch (err) {
        callback(null, buildErrorBody(err));
      }

      break;
    case 'DELETE': // DELETE /{team}/points/{pid}
      let deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `${team}/${event.pathParameters.pid}`
      };

      try {
        await s3.deleteObject(deleteParams).promise();
        callback(null, buildSuccessBody());
      } catch (err) {
        callback(null, buildErrorBody(err));
      }

      break;
    default:
      callback(null, buildErrorBody(err, 405));
      break;
  }
};

function buildErrorBody(err, code = 500) {
  console.error(err);
  return { statusCode: code };
}

function buildSuccessBody(data = {}) {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin' : '*' } // XXX review whether this header is needed for CORS support
  };
}