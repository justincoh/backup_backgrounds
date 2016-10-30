import settings
import boto3


session = boto3.session.Session(
   aws_access_key_id=settings.accessKeyId,
   aws_secret_access_key = settings.secretAccessKey,
   region_name = settings.region
)

s3 = download.session.resource("s3")
bucket = s3.Bucket("background-backups")
objects = [key for key in bucket.objects.all()]

# http://boto3.readthedocs.io/en/latest/guide/migrations3.html
