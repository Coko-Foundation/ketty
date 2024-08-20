## Setting up required services

:::note
This guide is for deploying Ketty (v2) in production. Refer to [Repositories & Setup](https://docs.ketty.community/docs/developerGuide/Repositories%20&%20Setup) to build Ketty (v2) or Editoria (v1) locally.
:::

There are a few things that need to be up and running before running the app:

- Databases
- S3-compatible object storage
- Coko microservices:
  - Pagedjs (pdf preview & generation)
  - XSweet (docx upload to html conversions)
  - EpubChecker (epub validation before generating file)

### Databases

The app, as well as each of the microservices needs a separate postgresql database to connect to.  
Make sure that the pgcrypto extension is installed on each of them.  
To install this extension you can run `CREATE EXTENSION IF NOT EXISTS pgcrypto;` in your postgres environment.

### Object storage

An S3 or S3-compatible (eg. Minio, Google cloud, Digital ocean and more) object storage bucket is needed for file uploads.

### Coko Microservices

Each of the microservices will need a client id and a client secret. These values will then be passed to Ketty's server as environment variables, so that the server can perform its authentication with the microservices. To get a valid id/secret pair, run `yarn create:client` in the respective microservice.

All microservices are published in dockerhub:

- Pagedjs: https://hub.docker.com/r/cokoapps/pagedjs/tags
- Xsweet: https://hub.docker.com/r/cokoapps/xsweet/tags
- Epubchecker: https://hub.docker.com/r/cokoapps/epubchecker/tags

For more details on how to run each microservice, check the read me file in the following repos:

- Pagedjs: https://gitlab.coko.foundation/cokoapps/pagedjs
- Xsweet: https://gitlab.coko.foundation/cokoapps/xsweet
- Epubchecker: https://gitlab.coko.foundation/cokoapps/epub-checker

---

## Running Ketty

Ketty is provided as two separate docker containers ([Ketty client](https://hub.docker.com/r/cokoapps/ketty-client/tags) and [Ketty server](https://hub.docker.com/r/cokoapps/ketty-server/tags)). The two containers will run on separate ports (or even separate machines if that suits the specific setup). The client image only serves a static bundle.

### Repositories

You can find the repos for Ketty server & client in the following links:

- Ketty client: https://gitlab.coko.foundation/ketty/ketty
- Ketty server: https://gitlab.coko.foundation/ketty/server

### Environment variables

First thing to do is to setup the correct environment variables in the environment where the containers will run. The most up to date list of environment variables can be found in the [production compose file](https://gitlab.coko.foundation/ketty/ketty/-/blob/main/docker-compose.demo-deploy.yml?ref_type=heads) in the Ketty repo. You can use this compose file as is, or recreate its logic with the docker compose equivalent of your choice (eg. kubernetes).

Some notes on specific variables:

- Make sure `NODE_ENV=production` on production environments
- Make sure `SERVER_SERVE_CLIENT` is set to `false`
- Make sure each container has a unique `SERVER_IDENTIFIER` value
- Make sure `FEATURE_UPLOAD_DOCX_FILES` is set to `true`
- Make sure `FEATURE_BOOK_STRUCTURE` is set to `false`
- Make sure `KETIDA_FLAVOUR` is set to `LULU`
- `FEATURE_POD=true` is required for v2
- `SERVICE_ICML_...` variables are optional, as they are not used in v2
- If you are not using wax's AI integration, you can skip the `AI_ENABLED` and `CHAT_GPT_KEY` variables
- `MAILER_...` variables are necessary for emails to work
- `WS_HEARTBEAT_INTERVAL`, `FAIL_SAFE_UNLOCKING_INTERVAL`, `TEMP_DIRECTORY_CRON_JOB_SCHEDULE` and `TEMP_DIRECTORY_CRON_JOB_OFFSET` are optional unless you want to override their values

### Config file

To enable export templates and integration with lulu, you will also need to mount a config file (eg. [with compose](https://gitlab.coko.foundation/ketty/ketty/-/blob/main/docker-compose.demo-deploy.yml?ref_type=heads#L67)) inside the server container at the `config/local.js` location.  
This will enable these specific templates, but you can also replace these with the templates of your choice.  
Note that in the lulu integration section, you should replace the `{clientUrl}` and `{luluClientId}` with proper values, as well as replace the sandbox values with their non-sandboxes equivalents.

```
module.exports = {
  templates: [
    {
      label: "lategrey",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/lategrey.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "significa",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/significa.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "bikini",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/bikini.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "vanilla",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/vanilla.git",
      assetsRoot: "dist",
      default: true,
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "atosh",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/atosh.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "eclypse",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/eclypse.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "logical",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/logical.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
    {
      label: "tenberg",
      url: "https://gitlab.coko.foundation/ketty/ketty-templates/tenberg.git",
      assetsRoot: "dist",
      supportedNoteTypes: ["footnotes"],
    },
  ],
  integrations: {
    lulu: {
      baseAPIURL: "https://api.sandbox.lulu.com/api/project-inject/projects",
      redirectUri: "{clientUrl}/provider-redirect/lulu",
      tokenUrl:
        "https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token",
      clientId: "{luluClientId}",
      loginUrl:
        "https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/auth",
      projectBaseUrl: "https://www.sandbox.lulu.com/account/projects",
    },
  },
};
```

### Websockets

The server container exposes two different ports, one for the main server and one for the websocket server (used for keeping chapters locked when a user is editing). You should map each of these to a different port on your machine. See [the server port part of the compose file](https://gitlab.coko.foundation/ketty/ketty/-/blob/main/docker-compose.demo-deploy.yml?ref_type=heads#L18-19) for reference.

### SSL

All containers will run on simple http or ws protocols, as they are meant to expose their ports only to the machine on which they are running. It is up to the specific sysadmin setup to map those exposed ports to a url that will have SSL certificates enabled (eg. via nginx reverse proxy or equivalent).
