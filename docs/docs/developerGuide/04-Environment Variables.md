## Server

### Core

| Name       | Description |
| ---------- | ----------- |
| `NODE_ENV` | Valid values are `development`, `production` and `test`. Defines the environment that your node process will be running in. Features may be turned on or off depending on the environment.|
| `PUBSWEET_SECRET` | The secret used for signing and verifying jwt tokens.|
| `PASSWORD_RESET_PATH_TO_PAGE` | The url path (without the host) for the password reset page. Used for creating links in reset password emails.|
| `SERVER_URL` | The url (including port), where the server can be found. This is necessary for implementing callbacks from external services.|
| `WEBSOCKET_SERVER_URL` | The url (including port) where the websocket server can be found. This is currently used for parsing the query params of websocket calls. The websocket server currently exists for handling locks.|
| `SERVER_PORT` | This defines the port that server will run on, both inside and outside of the container.|
| `WS_SERVER_PORT` | This defines the port that the websocket server (for locks) will run on, both inside and outside the container.|
| `CLIENT_URL` | The url that the client can be found at. This exists for two reasons: (a) to whitelist the client url at the CORS configuration, so that we don’t run into cross-origin errors in the browser and (b) to construct links that could eg. be constructed on the server, but shown in an email.|
| `SERVER_SERVE_CLIENT` | Whether the server container will also serve the static bundle of the client. This feature should be considered deprecated and should always be `false`.|
| `ADMIN_USERNAME` | The `ADMIN_*` variables allow you to optionally create an admin user at server startup with these values. |
| `ADMIN_PASSWORD` | See above. |
| `ADMIN_GIVEN_NAME` | See above. |
| `ADMIN_SURNAME` | See above. |
| `ADMIN_EMAIL` | See above. |

### Feature control

| Name       | Description |
| ---------- | ----------- |
| `KETIDA_FLAVOUR`: | This is a legacy variable that is only relevant to Editoria (v1). It differentiates between different setups of Editoria. Valid values are `VANILLA` and `BOOKSPRINTS`. This will change the permissions, the teams and the bookbuilder component that gets loaded. If `FEATURE_BOOK_STRUCTURE` is on, the value of `KETIDA_FLAVOUR` is ignored and the permissions, teams and bookbuilder variant of OEN are loaded instead. |
| `FEATURE_BOOK_STRUCTURE` | For this to be on, its value needs to be `true`. This feature flag essentially turns the OEN setup on. Book structure is a concept that exists for the OEN open textbook planner, where the structure of the book is defined while creating a new book. This loads a separate configuration of permissions, teams and variant of the bookbuilder. This needs to be turned off when Ketty (v2) is used (ie. if `FEATURE_POD` is turned on).|
| `FEATURE_UPLOAD_DOCX_FILES` | Should be `true` or `false`. If `false`, it will hide the “upload files” button in the book builder, which would allow uploading docx files for conversion. This is only used in v1, and should be set to ‘false’ for the OEN use case. |
| `FEATURE_POD` | This should always be `true` for Ketty (v2) instances and `false` for Editoria (v1) instances. This flag enables the permissions and teams that are needed for v2 to work. It also enables the creation of metadata, copyright and table of contents when creating a new book. When exporting, if this is on, export profiles will be utilized.  If on, `KETIDA_FLAVOUR` is overridden. |
| `AI_ENABLED` | Whether the app should enable its ChatGPT integration in wax. |
| `CHAT_GPT_KEY` | The API key from ChatGPT. |

### Locks

| Name       | Description |
| ---------- | ----------- |
| `WS_HEARTBEAT_INTERVAL` | How often the heartbeat event for the lock-related socket connections will be happening. See the “detecting a broken connection” section of the locks documentation. |
| `FAIL_SAFE_UNLOCKING_INTERVAL` | How often the server should check for expired locks that might need to be cleaned up. |

### Temp files

| Name       | Description |
| ---------- | ----------- |
| `TEMP_DIRECTORY_CLEAN_UP` | Whether or not to periodically clean up the temp directory of any potential leftover files. |
| `TEMP_DIRECTORY_CRON_JOB_SCHEDULE` | A valid cron value that specifies how often the temp directory should run. |
| `TEMP_DIRECTORY_CRON_JOB_OFFSET` | The minimum amount of time (in milliseconds) a file should exist before being cleaned up.

### Database connection

| Name       | Description |
| ---------- | ----------- |
| `POSTGRES_HOST` | The hostname of the postgres db |
| `POSTGRES_PORT` | The port of the postgres db |
| `POSTGRES_DB` | The database name of the postgres db |
| `POSTGRES_USER` | The username of the postgres db |
| `POSTGRES_PASSWORD` | The password of the postgres db |

### File storage connection

| Name       | Description |
| ---------- | ----------- |
| `S3_PROTOCOL` | The protocol of the S3 compatible server (eg. `https`) |
| `S3_HOST` | The hostname of the S3 compatible server |
| `S3_PORT` | The hostname of the S3 compatible server |
| `S3_ACCESS_KEY_ID_USER` | The access key id for accessing the S3 or equivalent account |
| `S3_SECRET_ACCESS_KEY_USER` | The secret access key for accessing the S3 or equivalent account |
| `S3_BUCKET` | The name of the specific S3 bucket the app will be using |
| `S3_SEPARATE_DELETE_OPERATIONS` | Whether to run delete operations on s3 one at a time instead of in bulk. This is useful for s3 compatible services that do not support bulk delete operations (such as GCP). Value should be `true` or `false`. |
| `S3_FORCE_PATH_STYLE` | This is an s3 option that might be required for certain providers to work (such as GCP). From the AWS docs: “When set to true, the bucket name is always left in the request URI and never moved to the host as a sub-domain.”

### Email

| Name       | Description |
| ---------- | ----------- |
| `MAILER_HOSTNAME` | The url of your mail provider. |
| `MAILER_USER` | The username in order to connect to the mail provider. |
| `MAILER_PASSWORD` | The password in order to connect to the mail provider. |
| `MAILER_SENDER` | What the sender of emails should appear as. |

### Microservices

| Name       | Description |
| ---------- | ----------- |
| `SERVICE_EPUB_CHECKER_URL` | The url of the epub checker microservice. |
| `SERVICE_EPUB_CHECKER_CLIENT_ID` | The client id for the epub checker microservice. |
| `SERVICE_EPUB_CHECKER_SECRET` | The client secret for the epub checker microservice. |
| `SERVICE_PAGEDJS_URL` | The url of the Pagedjs microservice. |
| `SERVICE_PAGEDJS_CLIENT_ID` | The client id for the Pagedjs microservice. |
| `SERVICE_PAGEDJS_SECRET` | The client secret for the Pagedjs microservice. |
| `SERVICE_XSWEET_URL` | The url of the XSweet microservice. |
| `SERVICE_XSWEET_CLIENT_ID` | The client id for the XSweet microservice. |
| `SERVICE_XSWEET_SECRET` | The client secret for the XSweet microservice. |
| `SERVICE_ICML_URL` | The url of the ICML microservice (only used in ketty v1). |
| `SERVICE_ICML_CLIENT_ID` | The client id for the ICML microservice. |
| `SERVICE_ICML_SECRET` | The client secret for the ICML microservice. |

## Client

| Name       | Description |
| ---------- | ----------- |
| `SERVER_URL` | The location where the client can find the server. |
| `WEBSOCKET_SERVER_URL` | The location where the client can find the websocket server. |
