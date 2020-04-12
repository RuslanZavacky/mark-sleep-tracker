# Baby Sleep Tracker with AWS IoT Button, AWS Lambda, Google Sheets

For our baby tracking we use https://glowing.com and their Baby Glow application. From what
I've reviewed, I think this is the best for us. Challenge in all this tracking comes when your
baby wakes up at night for feeds or other cases and you are half asleep trying to accommodate all the needs.
In times like that, taking your phone for all tracking is hard. If for diapers you can just collect them
and count in the morning, with sleep sometimes it is hard to remember exact time. Here is my solution that don't
require you to switch to your phone at night. 

You will require an (1) *AWS IoT Button*. So far I've used original one, even though it is discontinued now.
Will explore later other buttons. (2) Google Cloud Service Account with enabled Sheets write access.
(3) AWS Account and (4) a bit of knowledge of `node.js` (or maybe not). 


## 1. Setup Google Service Account

TBD

## 2. Setup AWS IoT Button

TBD

## 3. Setup Google Sheet

Share your Google sheet with the email 

## 4. Upload your code to AWS Lambda

I've added a simple `zip.sh` script that will zip your code into file `dist.zip` that you'll have to upload to AWS Lambda. 

# Environment Variables

| Variable                     | Description                                                                                                                                                                                                                                                                                                                                                             |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GOOGLE_SHEET_KEY             | ID of your Google Sheet where you want to store records                                                                                                                                                                                                                                                                                                                 |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | When you get service account from Google Cloud for a project. You will get an email.                                                                                                                                                                                                                                                                                    |
| GOOGLE_SERVICE_PRIVATE_KEY   | When you get service account from Google Cloud for a project. You will get a private key. Note! As we'll pass this key in AWS Lambda as environment variable and AWS Lambda don't support multi line environment variables, we need to add new line breaks later. I've chose to add `|||` (three pipes) instead of new lines in private key, to replace it in the code. |
| TIME_ZONE                    | Specify time zone that you will use in your Google Doc. By default - Europe/London. Refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for the time zone names.                                                                                                                                                                                      |
| DATE_FORMAT                  | For date operations I use `date-fns`. Default format - YYYY-MM-DD HH:mm:ss. You can specify any supported format from https://date-fns.org/v2.12.0/docs/format                                                                                                                                                                                                          |

### Future

* Migrate to https://serverless.com
* Add support for AWS IoT buttons from other providers that still work - https://aws.amazon.com/iot-1-click/devices/
* Integrate directly with Baby Glow API (https://github.com/elynde/glow-js). It is quite un-official, but looks promising.