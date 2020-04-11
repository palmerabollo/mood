# static

The static frontend.
Publish it to your own S3 bucket with public-read permissions. For example:

```sh
aws s3 sync . s3://mood.guidogarcia.net --acl public-read
```

The frontend is based on a [HTML5 UP](http://html5up.net) template and uses old-style jquery.