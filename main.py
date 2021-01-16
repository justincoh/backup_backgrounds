import os
import boto3

from datetime import datetime
from boto3.s3.transfer import TransferConfig
from dotenv import load_dotenv

from progress_percentage import ProgressPercentage


load_dotenv()
bucket_name = os.getenv("BUCKET_NAME")
file_path = os.getenv("BACKUP_FILE_PATH")
today = datetime.today().strftime('%Y-%m-%d') # yyyy-mm-dd


def transfer_config():
    chunk_size = 1024 * 25 # 25 MB
    return TransferConfig(
        multipart_threshold=chunk_size, # anything smaller won't be multipart
        max_concurrency=10, # max number of threads
        multipart_chunksize=chunk_size, # size of each chunk
        use_threads=True
    )


def multipart_upload_boto3():
    key = f"background-backup-{today}.zip"
    s3 = boto3.resource("s3")

    # if it fails just let it blow up
    s3.Object(bucket_name, key).upload_file(
        file_path,
        # ExtraArgs={'ContentType': 'text/pdf'},
        Config=transfer_config(),
        Callback=ProgressPercentage(file_path)
    )
