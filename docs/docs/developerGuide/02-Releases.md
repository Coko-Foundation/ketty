## Create a release

The following steps must be performed in order for a new release to happen.

**On the server side**

- First, a new server version needs to be published (if there are changes in the server). Merge your branch into `dev` and then into `main`. The pipelines on `main` will create the new version number and add the appropriate tag.
- Git checkout locally on the newly created tag.
- Manually build & publish the image on dockerhub (eg. for version 1.2.3):
  `docker buildx build --push --platform linux/arm64,linux/amd64 --tag cokoapps/ketty-server:latest --tag cokoapps/ketty-server:1.2.3 .`

**On the client side**

- Merge your changes into `develop`, then into `main`
- Pipelines will run on those branches and update the deployments (kettytest.cloud68.co & ketida.cokodemo.net)

:::note
For the time being, Ketty client releases do not have versions. This means that images published in dockerhub will have tags that reflect the last commit in the repo at the time.
::: 

## Announce a new release

In Gitlab, from https://gitlab.coko.foundation/ketty/ketty: 

* Go to Deploy, then select Releases and 'New release'
* Create a tag for the release number
* Use the release number as the title
* Link the release milestone
* Add the release notes which should include a description of: new features, improved features, bug fixes, breaking changes (if any), known issues with the release (if any).
* Link all the relevant images on dockerhub
* Link the homepage of these docs. 

