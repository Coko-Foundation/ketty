We use [fly.io](https://fly.io/) to host our own deployments. This is meant as a guide for organizations that want to use fly.io as well to host their own Ketty deployment.

## A brief summary of what you'll need

You'll need the following apps (ie. servers that run a specific container) running on fly.io:
* Ketty client
* Ketty server
* Epubchecker microservice
* Pagedjs microservice
* XSweet microservice
* Ketty flax

You'll also need:
* A database for Ketty server
* A database for the Epubchecker microservice
* A database for the Pagedjs microservice
* A database for the XSweet microservice
* A database for Ketty flax
* An S3 object storage bucket
* An email provider account
* A ChatGPT key (optional, if you want to use the AI feature in the settings)

## Databases

:::info
All databases need to be Postgres. Make sure that your database provider has support for the `pgcrypto` and `vector` extensions.
:::

:::tip
We use Digitalocean for our databases, which we can recommend. But you can choose any provider you prefer, as long as they can give you a postgres database with a CA certificate for authentication.
:::

:::tip
Digitalocean charges you per database cluster, not per database. This means that you can keep all databases within the same cluster, keeping costs down. Check if your database provider has a similar feature if cost is a concern.
:::

### Microservice databases

Microservices each need their own database, but the usage of that database is going to be very light (storing credentials and using a job queue). You can very likely get away with getting the cheapest database of your chosen provider for the microservices.

You will need four microservice databases:
* A database for the Epubchecker microservice
* A database for the Pagedjs microservice
* A database for the XSweet microservice
* A database for Ketty flax

### Ketty server database

This is the main database used by Ketty server.

#### Connection pools

For the main database only, even though it's not a hard technical requirement, we _highly_ recommend using connection pools. Depending on your database configuration, you might run into issues in Postgres where the connection limit is reached and further connections are dropped, resulting in failed database queries. This can be mitigated by using connection pools, but there's some steps that need to be done before everything works correctly.

Ketty uses Postgres for regular queries as you'd expect, but it also uses the `LISTEN/NOTIFY` Postgres feature to handle live updates.

When choosing a connection pool mode, you have a few options, but there's two that are of interest here:

* __Transaction mode__: Each transaction in the code is a single connection, and the connection is released when the transaction ends.
* __Session mode__: The client (a Ketty server query in our case) will open a connection which will remain alive until disconnected (eg. by the server stopping).

At first glance transaction mode sounds like what we want, but the catch is that `LISTEN/NOTIFY` is not supported in this mode. In other words, all will work well, but live updates will be broken. For live updates to work, we need a persistent connection (ie. session mode).

To work around this, we can set up multiple connection pools on the same database and let different features of Ketty connect to the pool they need to function correctly.

A possible setup could look like this:

* Set up two connection pools on the same database, one in transaction mode and one in session mode. Make sure most available connection slots are assigned to the transaction pool.
* You will now have two separate sets of database credentials. We will later use the two separate sets as environment variables.

### Encoding the CA certificate

We need to base64 encode the CA certificate so that it can be represented in a single line and passed as an environment variable. You do not need to worry about decoding it - Ketty will take care of that part.

First, download the CA certificate of your database / database cluster from your provider. The file is usually named `ca-certificate.crt`.

Then (in Linux):
```sh
base64 -w0 ca-certificate.crt
```

Store the output of this command for later use.

## S3 object storage

You could use AWS S3, or any other S3 compatible service. We use DigitalOcean's spaces. Fly.io has an integration with Tigris object storage which we've also used in the past without issues. You could also self-host a bucket if you want using Min.io. In all cases you'll need to have an access key id and a secret access key, so that Ketty can authenticate with your bucket.

## Email

Any email provider that gives you SMTP credentials could work. We use Sendgrid, but other options like Mailgun will work fine.


## Deploying the apps on fly.io

Before anything else
* Set up your account on fly.io
* Install the [flyctl](https://fly.io/docs/flyctl/install/) command line tool on your computer

Let's create a folder structure with all the files we'll need. This folder structure is optional, but it will make following the instructions along easier.

```
ketty-on-fly
- .gitignore
- epubchecker.toml
- epubchecker-secrets.env
- pagedjs.toml
- pagedjs-secrets.env
- xsweet.toml
- xsweet-secrets.env
- ketty-flax.toml
- ketty-flax-secrets.env
- ketty-server.toml
- ketty-server-secrets.env
- ketty-client.toml
```

Then `cd ketty-on-fly`, so that we're in the folder with all the configuration files.

:::info
The `app` key in fly.io toml files is the name that the app will appear on the fly.io dashboard. Feel free to change it to whatever suits you. They do not need to be user-friendly, as they will not be exposed to the end user.
:::

:::info
The images that you'll see in the toml files are images published by us on dockerhub. The versions will become outdated. For each app further down, there will be a link pointing to its dockerhub page where you can check what the latest version is.
:::

:::info
We'll be using `lhr` as a deployment region in all files, but you can change that ([see available fly regions](https://fly.io/docs/reference/regions/)).
:::

:::info
Under the `vm` section of the toml files, we'll show the configurations that we use for cpu and memory. This section will be the primary option that affects pricing. Make sure you understand your [options](https://fly.io/docs/about/pricing/) and change this section to suit your needs and budget.
:::

:::info
Fly.io by default launches all apps in two replicas. This has cost implications, but increases availability. Some of the apps (including Ketty server) will only work properly as a single machine. When this is the case, there will be a `scale` command that instructs you to manually scale the app down to one machine.
:::

:::info
Both the `env` section of the toml file and the `.env` files in our folder structure will end up as environment variables in the container. A simple way to think about it is to store non-sensitive values in the toml file and sensitive values outside of it. Sensitive values will end up as "fly secrets". Secrets can also be added / edited through the fly.io web interface.
:::

:::tip
Apps on fly.io, depending on their configuration, will spin down when idle. This can be useful for microservices that do not need to be running all the time. Since fly.io charges for uptime, this can cut the cost of running an app significantly - at the expense of a few seconds of lag when the app spins back up. Ketty server will not spin down because of long-running operations that will keep it alive.
:::

:::tip
If your app on fly.io does not respond, first check that fly.io has assigned the app an ip address by looking at the overview section on the fly.io web interface. If not, you can manually assign ip addresses with the following commands:
```sh
flyctl -a myapp ips allocate-v4 --shared
flyctl -a myapp ips allocate-v6
```
:::

:::tip
You can check the logs of a specific app with `flyctl logs -a myapp`.
:::

:::warn
All values provided in the .env files are for display purposes. Make sure you change them to valid values.
:::

You only need the `.gitignore` file if you are planning to push the configuration files to a repository. If you do use it, make sure you do not commit all the files with the secrets.

```bash
# .gitignore

*.env
```

### Getting a client id & secret

All microservices need a client id and secret passed as environment variables. These tell each service what their valid authentication credentials are and are then used by ketty server to securely connect to the services. In order to generate client id/secret pairs, the easiest way is to clone one of the microservices locally and generate as many valid pairs as you need.

```bash
# Assuming you have git and docker installed locally
git clone https://gitlab.coko.foundation/cokoapps/pagedjs.git
cd pagedjs
docker compose build
docker compose up # run once so that database migrations run, then kill
docker compose run --rm server yarn create:client
```

### Deploy epubchecker

On dockerhub: [cokoapps/epubchecker](https://hub.docker.com/r/cokoapps/epubchecker/tags)

Edit the relevant files:

```toml
# epubchecker.toml
app = 'myorg-epubchecker'
primary_region = 'lhr'

[build]
image = 'cokoapps/epubchecker:2.0.3'

[http_service]
internal_port = 8080
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '1gb'
cpu_kind = 'shared'
cpus = 1

[env]
NODE_ENV = "production"
SERVER_PORT = 8080
SERVER_URL = "https://myorg-epubchecker.fly.dev"
```

:::info
A `SECRET` can be any string you like, but we recommend making it a hard to guess one, like you would for a password. We also recommend using different secrets for different apps.
:::

```bash
# epubchecker-secrets.env
CLIENT_ID=epubchecker-client-id
CLIENT_SECRET=epubchecker-client-secret

POSTGRES_HOST=yourpostgresprovider.com
POSTGRES_PORT=12345
POSTGRES_DB=epubchecker-db
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpassword
POSTGRES_CA_CERT=base64-encoded-ca-cert-string

SECRET=your-secret-string
```

Now let's create the app
```bash
flyctl apps create myorg-epubchecker # same value as the app key in the toml file
flyctl -a myorg-epubchecker secrets import < epubchecker-secrets.env
flyctl deploy --config epubchecker.toml
```

Validate that the app is running correctly:
```bash
curl https://myorg-epubchecker.fly.dev/healthcheck
```
If you get a json object as a response, you're good to go.

The process will be very similar for the rest of the apps.

### Deploy Pagedjs

On dockerhub: [cokoapps/pagedjs](https://hub.docker.com/r/cokoapps/pagedjs/tags)

Edit the relevant files:

```toml
# pagedjs.toml
app = 'myorg-pagedjs'
primary_region = 'lhr'

[build]
image = 'cokoapps/pagedjs:2.0.7'

[http_service]
internal_port = 8080
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '1gb'
cpu_kind = 'shared'
cpus = 1

[env]
NODE_ENV = "production"
SERVER_PORT = 8080
SERVER_URL = "https://myorg-pagedjs.fly.dev"
```

```bash
# pagedjs-secrets.env
CLIENT_ID=pagedjs-client-id
CLIENT_SECRET=pagedjs-client-secret

POSTGRES_HOST=yourpostgresprovider.com
POSTGRES_PORT=12345
POSTGRES_DB=pagedjs-db
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpassword
POSTGRES_CA_CERT=base64-encoded-ca-cert-string

SECRET=your-secret-string
```

Create the app
```bash
flyctl apps create myorg-pagedjs
flyctl -a myorg-pagedjs secrets import < pagedjs-secrets.env
flyctl deploy --config pagedjs.toml
flyctl -a myorg-pagedjs scale count 1 # run only one pagedjs server
```

Validate that the app is running:
```bash
curl https://myorg-pagedjs.fly.dev/healthcheck
```

### Deploy XSweet

On dockerhub: [cokoapps/xsweet](https://hub.docker.com/r/cokoapps/xsweet/tags)

Edit the relevant files:

```toml
# xsweet.toml
app = 'myorg-xsweet'
primary_region = 'lhr'

[build]
image = 'cokoapps/xsweet:3.0.3'

[http_service]
internal_port = 8080
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '2gb'
cpu_kind = 'performance'
cpus = 1

[env]
NODE_ENV = "production"
SERVER_PORT = 8080
SERVER_URL = "https://myorg-xsweet.fly.dev"
```

```bash
# xsweet-secrets.env
CLIENT_ID=xsweet-client-id
CLIENT_SECRET=xsweet-client-secret

POSTGRES_HOST=yourpostgresprovider.com
POSTGRES_PORT=12345
POSTGRES_DB=xsweet-db
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpassword
POSTGRES_CA_CERT=base64-encoded-ca-cert-string

SECRET=your-secret-string
```

Create the app
```bash
flyctl apps create myorg-xsweet
flyctl -a myorg-xsweet secrets import < xsweet-secrets.env
flyctl deploy --config xsweet.toml
```

Validate that the app is running:
```bash
curl https://myorg-xsweet.fly.dev/healthcheck
```

### Deploy Ketty flax

On dockerhub: [cokoapps/ketty-flax](https://hub.docker.com/r/cokoapps/ketty-flax/tags)

Edit the relevant files:

```toml
# ketty-flax.toml
app = 'myorg-ketty-flax'
primary_region = 'lhr'

[build]
image = 'cokoapps/ketty-flax:e62984cd160ec53f128e334e95dfbafa0c2836c4'

[http_service]
internal_port = 8080
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '1gb'
cpu_kind = 'shared'
cpus = 1

[env]
NODE_ENV = "production"
SERVER_PORT = 8080
```

```bash
# ketty-flax-secrets.env
CLIENT_ID=ketty-flax-client-id
CLIENT_SECRET=ketty-flax-client-secret

POSTGRES_HOST=yourpostgresprovider.com
POSTGRES_PORT=12345
POSTGRES_DB=ketty-flax-db
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpassword
POSTGRES_CA_CERT=base64-encoded-ca-cert-string

SECRET=your-secret-string
```

Create the app
```bash
flyctl apps create myorg-ketty-flax
flyctl -a myorg-ketty-flax secrets import < ketty-flax-secrets.env
flyctl deploy --config ketty-flax.toml
flyctl -a myorg-ketty-flax scale count 1 # run only one ketty-flax server
```

Validate that the app is running:
```bash
curl https://myorg-ketty-flax.fly.dev/healthcheck
```

### Deploy Ketty server

On dockerhub: [cokoapps/ketty-server](https://hub.docker.com/r/cokoapps/ketty-server/tags)

:::info
The server and the client are meant to run on the same relase tag.
:::

Edit the relevant files:

```toml
# ketty-server.toml
app = 'myorg-ketty-server'
primary_region = 'lhr'

[build]
image = 'cokoapps/ketty-server:2025.07.25-1'

[http_service]
internal_port = 3000
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 1
processes = ['app']

[[services]]
protocol = 'tcp'
internal_port = 3000

[[services.ports]]
port = 80
handlers = ['http']

[[services.ports]]
port = 443
handlers = ['tls', 'http']

[[services]]
protocol = 'tcp'
internal_port = 3333

[[services.ports]]
port = 3333
handlers = ['tls', 'http']

[[vm]]
memory = '1gb'
cpu_kind = 'shared'
cpus = 2

[env]
NODE_ENV = "production"
CLIENT_URL = "https://www.myorg-ketty.com" # The public URL of your app
SERVER_URL = "https://myorg-ketty-server.fly.dev"
WEBSOCKET_SERVER_URL = "wss://myorg-ketty-server.fly.dev:3333"
KETIDA_FLAVOUR = "LULU"
FEATURE_UPLOAD_DOCX_FILES = true
FEATURE_BOOK_STRUCTURE = false
FEATURE_POD = true
SERVICE_EPUB_CHECKER_URL = "https://myorg-epubchecker.fly.dev"
SERVICE_PAGEDJS_URL = "https://myorg-pagedjs.fly.dev"
SERVICE_XSWEET_URL = "https://myorg-xsweet.fly.dev"
SERVICE_FLAX_URL = "https://myorg-ketty-flax.fly.dev"
TEMP_DIRECTORY_CLEAN_UP = true
AI_ENABLED = true
CORS_ORIGIN = "https://myorg-ketty-client.fly.dev" # allow connections from here as well
```

```bash
# ketty-server-secrets.env
SECRET=your-secret-string

POSTGRES_HOST=yourpostgresprovider.com
POSTGRES_PORT=12345
POSTGRES_DB=ketty-server-db-transaction-pool
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpassword
POSTGRES_CA_CERT=base64-encoded-ca-cert-string
SUBSCRIPTIONS_POSTGRES_DB=ketty-server-db-transaction-pool

S3_URL=mys3service.com
S3_BUCKET=ketty-bucket
S3_ACCESS_KEY_ID_USER=my-access-key-id
S3_SECRET_ACCESS_KEY_USER=my-secret-access-key

MAILER_SENDER=kettyrobot@myorg.com
MAILER_HOSTNAME=smtp.sendgrid.net
MAILER_PORT=465
MAILER_USER=apikey
MAILER_PASSWORD=the-email-provider-password

ADMIN_USERNAME=admin
ADMIN_PASSWORD=the-admin-password
ADMIN_GIVEN_NAME=Josh
ADMIN_SURNAME=Brown
ADMIN_EMAIL=jbrown@example.com

SERVICE_EPUB_CHECKER_CLIENT_ID=epubchecker-client-id
SERVICE_EPUB_CHECKER_SECRET=epubchecker-client-secret

SERVICE_PAGEDJS_CLIENT_ID=pagedjs-client-id
SERVICE_PAGEDJS_SECRET=pagedjs-client-secret

SERVICE_XSWEET_CLIENT_ID=xsweet-client-id
SERVICE_XSWEET_SECRET=xsweet-client-secret

SERVICE_FLAX_CLIENT_ID=ketty-flax-client-id
SERVICE_FLAX_SECRET=ketty-flax-client-secret

CHAT_GPT_KEY=your-gpt-api-key
```

Create the app
```bash
flyctl apps create myorg-ketty-server
flyctl -a myorg-ketty-server secrets import < ketty-server-secrets.env
flyctl deploy --config ketty-server.toml
flyctl -a myorg-ketty-server scale count 1 # run only one ketty server
```

Validate that the app is running:
```bash
curl https://myorg-ketty-server.fly.dev/healthcheck
```

### Deploy Ketty client

On dockerhub: [cokoapps/ketty-client](https://hub.docker.com/r/cokoapps/ketty-client/tags)

Edit the relevant files:

```toml
# ketty-client.toml
app = 'myorg-ketty-client'
primary_region = 'lhr'

[build]
image = 'cokoapps/ketty-client:2025.07.25-1'

[http_service]
internal_port = 80
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
size = 'shared-cpu-1x'

[env]
SERVER_URL = "https://myorg-ketty-server.fly.dev"
WEBSOCKET_SERVER_URL = "wss://myorg-ketty-server.fly.dev:3333"
```

There are no secret variables for Ketty client.

Create the app
```bash
flyctl apps create myorg-ketty-client
flyctl deploy --config ketty-client.toml
```

To validate that the client is up and running, we can simply visit `https://myorg-ketty-server.fly.dev` on our browsers. If the page loads, and we're greeted with a login screen, all is well.

## DNS

Now that you have everything running, you need to configure your DNS settings. The only app that needs a DNS record is the client, as it will be the only user-facing URL. To do that, in your DNS  provider's website, set a `CNAME` record that points your public-facing URL (`www.myorg-ketty.com` in the examples above) to the client's fly.io deployment (`myorg-ketty-client.fly.dev.` in the examples).
