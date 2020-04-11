# mood

Do you know how your team is feeling? Why don't you ask them?

Mood is a web tool to anonymously gauge how your team is feeling and start optimizing for happiness.
It helps you increase empathy and reduce burnout.

Feel free to use the [working demo](https://mood.guidogarcia.net).

## How to install

It is a serverless app composed of:
- A [static frontend](./static) that should be uploaded to a S3 bucket (with public-read permissions) and published as a web page.
- A [backend](./lambda-backend) that is an AWS Lambda function that uses S3 as a cheap database to store the information.

## LICENSE

Copyright 2020 - Guido García (guido.garcia AT protonmail DOT com)

Licensed under the GNU Affero General Public License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.