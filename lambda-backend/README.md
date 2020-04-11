# lambda-backend

The backend is a [AWS Lambda](https://aws.amazon.com/es/lambda/) function.
It uses an AWS S3 bucket as a cheap database to store points.

Use [serverless](https://serverless.com/) to insall the backend ([nodejs](https://nodejs.org) required):

```sh
export AWS_ACCESS_KEY_ID=your-aws-key
export AWS_SECRET_ACCESS_KEY=your-own-aws-secret

npx serverless deploy
```
All the resources (the S3 bucket and the Lambda function) are automatically created.
Take a look at [serverless.yml](./serverless.yml) that should be self-explanatory.

To uninstall everything, just run:

```sh
npx serverless remove
```
