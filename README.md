# Netlify experiments

## Goals 

The purpose of this exercise is to show how Netlify can be used to support a development process. 
We would like to achieve the following goals:

1. Find out if a new commit can be deployed automatically.
1. Support testing by a group of people on a stable version of the site. 
1. Try out a version of the site in production to find out if version A or version B works better. 

### Getting Started 

Below I'll assume you've created an account on Netlify. You can do that using their free plan. For lack of inspiration, I named my team after myself.
![Netlify team](https://github.com/jvermeir/netlify/blob/main/images/TeamSetup.png "Team Setup"). I've set the site name to `jan-vermeir` so Netlify will deploy to this url: 
!(https://jan-vermeir.netlify.app/ "https://jan-vermeir.netlify.app/").

### Set up a site to deploy from Github.

One of the nice features of Netlify is its smooth integration with Git repositories like GitHub. I've granted Netlify permission to access this repository, so it can deploy changes automatically.

Details can be found here: [Netlify repository permissions](https://docs.netlify.com/configure-builds/repo-permissions-linking/ "Netlify repository permissions").
In summary:

1. Select the `sites` tab, then the `New site from Git` button.
1. This will pop up a new window from GitHub asking to grant permissions to Netlify. This enables the Netlify integration with GitHub. 
1. Now you need to grant permissions for each repository you wish to deploy with Netlify. This can be done with the '`configure Netlify on GitHub'` button.
   ![Configure Netlify on GitHub](https://github.com/jvermeir/netlify/blob/main/images/ConfigureGitHubIntegration.png "Configure Netlify on GitHub").
1. This pops up a new window allowing you to configure Netlify's permissions on GitHub. I've given Netlify permissions to deploy this repository only (https://github.com/jvermeir/netlify).
1. You can check the configuration on GitHub by accessing `applications` in your account settings.

![GitHub account settings](https://github.com/jvermeir/netlify/blob/main/images/NetlifyOnGitHubConfig.png "GitHub account settings")

### Automated deployment

With the configuration above in place, we can now enable automated deployment for each commit to the main branch. The third tab of the `New site from Git` dialog allows selecting a branch to deploy and the configuration of the build and deploy itself.
In my case there's no more than an index.html file that used to be in the root of the repository. Publishing that would mean that all content of the repository is accessible. That seemed like a bad idea, so
I moved the index.html file to a folder named `public` and set the `Publish directory` property to `public`.

![Settings for deployment](https://github.com/jvermeir/netlify/blob/main/images/DeploySettings.png "Settings for deployment")

So now the basics are in place, we can move on to automated deployment for every commit to a specific branch.

### Branch Deploys

By default, Netlify will only deploy changes made to the main branch. It's easy to add other branches, though. 
Branch deploys are useful to share changes with others before making them public. One usecase would be to deploy to a staging environment to allow others to test changes. 
Suppose our workflow looks like this:
- create some feature branches of main to implement a number of changes.  
- merge feature branches into a release branch.
- deploy the release branch so all changes can be tested as a whole.

To configure which branches will be deployed, go to `Site settings > Build & deploy > Continuous Deployment`. There you'll find the `deploy contexts` settings. Add `staging` in the input field for `additional branches`. 
To test this, I've created a branch named `staging` and pushed a change like this:

```
git checkout -b staging
echo "I'm on staging" > public/staging.html
git add .
git commit -m "deploy to staging"
git push --set-upstream origin staging
```

Now the `deploys` tab should show an extra deployment for staging. Note that this may take a while to show up in the list. 
The url for this deployment is computed from the base name for the site, in combination with the name of the branch: 

```
https://staging--jan-vermeir.netlify.app/staging.html
```

So `staging--jan-vermeir` in this case because my domain is `jan-vermeir` and the branch is `staging`.

More details can be found in the docs:
[Branch deploys](https://docs.netlify.com/site-deploys/overview/#branches-and-deploys "branch deploys")

### Deploy Previews

Netlify can deploy a new version when a pull request is started on GitHub. To activate go to `settings > build and deploy > deploy contexts` and
activate `Deploy Previews`.

![Deploy Preview](https://github.com/jvermeir/netlify/blob/main/images/DeployPreview.png "Deploy Previews")

Now start a new branch, make a change and push. On GitHub, start a pull request. The GitHub UI will now show the deployment to Netlify in progress.

![Merge check](https://github.com/jvermeir/netlify/blob/main/images/MergeCheck.png "GitHub triggers build and deploy")

You can access the deployment from GitHub by clicking the `Details` link in the last line shown in the image above. Or by moving back to Netlify's deploy tab and clicking the link for 'Deploy Preview #2'. This will open a browser with new deployment.
The same details are available on the site overview page.
As long as the pull request is open, new commits will trigger a new deploy to the same url. I've added a file named `branch1.html`. This is accessible on this url `https://deploy-preview-2--jan-vermeir.netlify.app/branch1.html`. 
Every commit to the branch triggers a new deploy and the url will remain the same. 

![Deploy Preview overview](https://github.com/jvermeir/netlify/blob/main/images/DeployPreviewOverview.png "Deploy Preview Overview")

Older deployments remain available: clicking one of the `Deploy preview #2` links on the site overview page will show the build for that particular commit and provides a link to the deployment. 


### Set up A/B testing 

A/B testing is called 'Split Testing' by Netlify. It is accessible via the main menu. I spent quite some time looking for this option, I'm afraid, so here's a screenshot.

![Split testing link](https://github.com/jvermeir/netlify/blob/main/images/splitTestingLink.png "Split testing link")

To start using this feature, we first need to create a bunch of branches. So I've added three branches to my repository, `branchA`, `branchB` and `branchC` and added a line to the index.html page, so the branches are easy to identify. 
These branches aren't automatically deployed by Netlify. By default, it will only deploy main (or master). To change that, open `deploy settings` and add the branches you need in the test 
under `branch deploys` in the `additional branches` input box. Note that you can add branches that aren't even there yet. Also make sure each branch appears in its own little box with an 'x' next to it. Netlify doesn't 
check these branch names, you'll just not see what you expected when selecting a branch for the split test. 

![Split testing configuration](https://github.com/jvermeir/netlify/blob/main/images/splitTestingConfiguration.png "Split testing configuration")

In each branch I've added an identifier in pages/index.html, so it looks like this:

```
<body>hello world. This is branch B. v3</body>
```

With these branches in place we can start a test. In the `split testing` tab I configured three extra branches, so it looks like this:

![Split testing setup](https://github.com/jvermeir/netlify/blob/main/images/splitTestingSetup.png "Split testing setup")

and click the `Start test` button. 

To validate the config works, I've added a script named `./spilt-testing.sh`. The script curls to https://jan-vermeir.netlify.app/ every couple seconds and show it returns one of the four versions that are now available.
The output of the script will look like this:

```
<body>hello world. This is branch C. v2</body>
<body>hello world. This is branch B. v3</body>
<body>hello world. This is branch C. v2</body>
<body>hello world. This is branch A. v3</body>
<body>hello world</body>
<body>hello world. This is branch A. v3</body>
<body>hello world. This is branch B. v3</body>
<body>hello world</body>
```

Super easy.
You can even change this test on the fly, by adding or removing branches on the split testing configuration page. Or you can stop the test at any time and resume it later. 

Using curl from the command line like above, will start a new session with every request. Netlify sets a cookie named `nf_ab` that identifies the client, so if the cookie is passed 
with a new request, the same version of the site will be used:

```
$ curl -c ./cookies.txt https://jan-vermeir.netlify.app/
<body>hello world. This is branch B. v3</body>
$ curl -b ./cookies.txt https://jan-vermeir.netlify.app/
<body>hello world. This is branch B. v3</body>
$ curl -b ./cookies.txt https://jan-vermeir.netlify.app/
<body>hello world. This is branch B. v3</body>
```

### Using Functions

Over the past years I've tried working with lambda functions on and off a couple of times. Each time I got stuck, either clicking in AWS UIs or writing YAML files. 
Netlify changes all that by making lambda's easy to use. Below I'll describe the basics of deploying a function, and I'll show how the development tools support local development. 



# TODO

## Other stuff 

### cli 

https://docs.netlify.com/cli/get-started/#netlify-dev

### Functions

https://docs.netlify.com/configure-builds/common-configurations/gatsby/
https://atila.io/netlify-functions-typescript
https://docs.netlify.com/functions/overview/

Add a folder named `netlify/functions`.
Add a file named `hallo.js` and copy the code below

```
exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World"})
    };
}
```

Access the hallo function at `/.netlify/functions/hallo`