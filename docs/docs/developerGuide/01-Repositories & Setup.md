## Ketty repositories

### Ketty server

The server used by all Ketty clients  
Link: https://gitlab.coko.foundation/ketty/server

### Ketty clients

:::note
Ketty client evolved from its predecessor, Editoria. We will continue to support Editoria until all the necessary features have been transferred to Ketty, however new features will only be merged for Ketty client. 
:::

**Ketty client** (also mentioned as "v2" or “Lulu” or “POD” - print on demand)  
The current client — this is maintained and new features are released every month.
Link: https://gitlab.coko.foundation/ketty/ketty  


**Editoria** (also mentioned as “v1”) 
The previous client — this is only maintained.
Link https://gitlab.coko.foundation/ketty/editoria

**OEN**  
Essentially the same as Editoria, but with book structure enabled, and docx uploads disabled (both controlled via [environment variables](docs/docs/developerGuide/04-Environment Variables.md)). The only feature that OEN introduces compared to v1 is the open textbook planner (and the corresponding book structure property in the book model). This is part of the same repo as Editoria.

## Microservices

Ketty uses a few microservices that are part of the broader Coko ecosystem.

**Pagedjs**  
Link: https://gitlab.coko.foundation/cokoapps/pagedjs  
Generates a PDF out of HTML content.

**XSweet**  
Link: https://gitlab.coko.foundation/cokoapps/xsweet  
Converts `.docx` files to HTML.

**Epubchecker**  
Link: https://gitlab.coko.foundation/cokoapps/epub-checker  
Checks the validity of an epub file.

**ICML**  
Link: https://gitlab.coko.foundation/cokoapps/icml  
Converts HTML to ICML.

The required microservices for each client to function properly are as follows:

- Editoria
  - Pagedjs
  - XSweet
  - Epubchecker
  - ICML
- OEN
  - Pagedjs
  - Epubchecker
  - ICML
- Ketty client
  - Pagedjs
  - XSweet
  - Epubchecker

For OEN, XSweet is not needed, as there is no docx ingestion.  
For Ketty client, ICML is not needed, as the use case for it hasn’t come up yet.

## File storage

A connected file server (eg. Minio, S3, Google cloud etc) is necessary in all of the above scenarios. We use Minio in development.

In case google cloud platform (GCP) is used the following two environment variables need to be on for it to work as expected:

```
S3_SEPARATE_DELETE_OPERATIONS=true
S3_FORCE_PATH_STYLE=false
```

Both the file server and the microservices are handled by the corresponding compose files.

## Published images

The following images are published on [cokoapps dockerhub](https://hub.docker.com/u/cokoapps):

- Ketty server
- Ketty client
- All the aforementioned microservices

Editoria (and by extension OEN) are not currently being published as images on dockerhub, and would need to be built to be deployed.

## KDK

Having these different repos can make it difficult to work in development. To get around that, we have the KDK (ketida development toolkit) that brings all the repos together in an environment that would let the developer be more productive.  
Link: https://gitlab.coko.foundation/ketty/kdk

The KDK has 3 different docker compose files, one for each ketty version (Editoria, OEN and Ketty), that will start all necessary servers and microservices for your selected version. After executing `setup.sh`:

- if you want to develop for Ketty run `docker-compose up`
- if you want to develop for OEN run `docker-compose -f docker-compose.oen.yml up`
- if you want to develop for Editoria run `docker-compose -f docker-compose.vanilla.yml up`

Once the containers are up,

- open your browser at `https://localhost:4000`
- log in with the default admin credentials: admin@example.com / password

:::note

There is a very good chance that we’ll move all the corresponding `ketty/*` repos under one single repo in the near future. For the time being, work with the KDK.

:::
