const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uuid = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const pick = (O, ...K) => K.reduce((o, k) => (o[k]=O[k], o), {});

module.exports.points = async (event, _, callback) => {
  const team = event.pathParameters.pid;

  switch (event.httpMethod) {
    case 'GET': // GET /{team}/points
      let searchParams = {
        Bucket: process.env.S3_BUCKET,
        Prefix: `${team}/`
      };

      try {
        // XXX paginate to be able to deal with more than 1000 points, see "s3-ls" module
        const result = await s3.listObjectsV2(searchParams).promise();
        const points = result.Contents.map(object => pick(object, 'Key', 'LastModified'));
        callback(null, buildSuccessBody(points));
      } catch (error) {
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
      } catch (error) {
        callback(null, buildErrorBody(err));
      }

      break;
    case 'DELETE': // DELETE /{team}/points/{pid}
      // XXX users can delete any object in the bucket, not only those created by them
      let pid = event.pathParameters.pid;

      let deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `${team}/${pid}`
      };

      try {
        await s3.deleteObject(deleteParams).promise();
        callback(null, buildSuccessBody());
      } catch (error) {
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