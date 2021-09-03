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
The most basic hello world example I could come up with can be found in this repo, tagged 'basic-javascript-lambda'. There's a simple index.html file (a left over from earlier experiments), 
and a hallo.js file in src/functions. That almost works, but it needs one specific bit of configuration in a file named netlify.toml, located in the root of the repository. 

The Javascript file looks like this, returning a 200 OK response and a JSON formatted message:
```
exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World - v2"})
    };
}
```

The netlify.toml file looks like this:

```
[build]
    base = "src"
    publish = "site"
[functions]
    directory = "functions"
```

So it sets the `base` folder for all code. Because there's no fancy preprocessing going on (I'm using a plain html file that can be served as a static resource), the value of `publish` is set 
to the folder that contains the single html file. Given this configuration, html files should be in a folder named `src/site` in the root of the repository.
The root folder for functions is `functions`. This folder is also a subfolder for `src`, so function files for Javascript are stored in `src/functions` in the root of the repository.
The toml file is described in https://docs.netlify.com/configure-builds/file-based-configuration/.
All we need for a simple Javascript function that has no dependencies or build script is this:

```
.
./netlify.toml
./src
./src/site
./src/site/index.html
./src/functions
./src/functions/hallo.js
```

Note that if you start using netlify.toml, the Netlify console may show confusing information. Once the version above is deployed, the configuration is replaced with the contents of netlify.toml. It 
is still possible to change paths using the web console, but changes made there are ignored. 

After committing and pushing these changes, Netlify shows this in the deployment log:

```
3:39:12 PM: Build ready to start
...
3:39:39 PM: ────────────────────────────────────────────────────────────────
3:39:39 PM:   Netlify Build                                                 
3:39:39 PM: ────────────────────────────────────────────────────────────────
...
3:39:39 PM: ❯ Current directory
3:39:39 PM:   /opt/build/repo/src
3:39:39 PM: ❯ Config file
3:39:39 PM:   /opt/build/repo/netlify.toml
...
3:39:39 PM: ────────────────────────────────────────────────────────────────
3:39:39 PM:   1. Functions bundling                                         
3:39:39 PM: ────────────────────────────────────────────────────────────────
3:39:39 PM: Packaging Functions from functions directory:
3:39:39 PM:  - hallo.js
...
3:39:39 PM: ────────────────────────────────────────────────────────────────
3:39:39 PM:   2. Deploy site                                                
3:39:39 PM: ────────────────────────────────────────────────────────────────
...
3:39:40 PM: (Deploy site completed in 176ms)
...
3:39:51 PM: Finished processing build request in 27.770218813s
```

Noticing the log line at 3:39:39 PM, I thought 'yes! works!' and hit `curl https://jan-vermeir.netlify.app/hallo`
But that didn't work, unfortunately. The URL wasn't immediately clear to me, but luckily there's an easy way to find out in the web console under `functions` (who would have thought, oh well...).

![Functions](https://github.com/jvermeir/netlify/blob/main/images/functions.png "Functions")

This shows a list of deployed functions and how to call them:

![Functions Details](https://github.com/jvermeir/netlify/blob/main/images/functionDetails.png "Functions Details")

This shows the actual URL of the endpoint: 

```
$ curl https://jan-vermeir.netlify.app/.netlify/functions/hallo
{"message":"Hello World - v2"}
```

#### Summary 

At least simple things are simple, if you don't overlook obvious things like buttons named 'functions'. I guess the web console and me aren't going to be friends any time soon. 

### Netlify CLI 

The Netlify CLI tool can be used to support local development but also in scripting on a build server. I'll show how to install and setup the tool and how to use it in scripts. 

#### Basics 

```
npm install netlify-cli -g
```
```
netlify login
```
This opens a web page where you use your credentials to log in. The result is a file in your home folder, in my case 

```
~/Library/Preferences/netlify/config.json
```

This file contains user data and a token. Next we have to `link` a site, i.e. the site all future commands will be executed on:

```
 $ netlify link

netlify link will connect this folder to a site on Netlify

? How do you want to link this folder to a site? (Use arrow keys)
❯ Use current git remote origin (https://github.com/jvermeir/netlify)
  Search by full or partial site name
  Choose from a list of your recently updated sites
  Enter a site ID
```

I choose the default option, linking the CLI to my test site based on my test repository.

The site can be build with `netlify build`, which will result in a zip file stored in the base folder of the site:

![Build Folder](https://github.com/jvermeir/netlify/blob/main/images/buildFolder.png "Build Folder")

In this simple case, the build command doesn't add too much value, but if the build becomes more complex it could be useful.

Using the `deploy` option, a local build of the site can be deployed to Netlify. This allows external build tools to be used, where a version is build and packaged and then has to be deployed from the package. One example could be pulling a version from an artifact repository like 
![Artifactory](https://jfrog.com/artifactory/ "Artifactory"). Or if you're stuck with a build server like BitBucket or Jenkins.

This is the log of a deployment:
```
 $ netlify deploy
Deploy path:        /Users/jan/dev/netlify/src/site
Functions path:     /Users/jan/dev/netlify/src/functions
Configuration path: /Users/jan/dev/netlify/netlify.toml
Deploying to draft URL...
✔ Finished hashing 2 files and 1 functions
✔ CDN requesting 0 files and 1 functions
✔ Finished uploading 1 assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/jan-vermeir/deploys/60a772523afb8f96284dcd78
Website Draft URL: https://60a772523afb8f96284dcd78--jan-vermeir.netlify.app

If everything looks good on your draft URL, deploy it to your main site URL with the --prod flag.
netlify deploy --prod
```

Note that a temporary URL is created for the deployment (https://60a772523afb8f96284dcd78--jan-vermeir.netlify.app in this case). As the log says, use 

```
netlify deploy --prod
```

to push this version to production. 

#### Using the dev tool 

One interesting option of the CLI is the `dev` tool (see https://github.com/netlify/cli/blob/main/docs/netlify-dev.md). This tool allows local deployment of a site, so it can be easily tested. 
The killer feature of this tool in my opinion is that it allows debugging. To test that out I've started the dev tool using VSCode: 

![Debugger in VSCode](https://github.com/jvermeir/netlify/blob/main/images/debugger.png "Debugger in VSCode")

The window at the top shows the hallo function with a breakpoint set on the line that logs to the console. I've started netlify dev in the terminal at the bottom of the window. 
This shows the functions server is listening on 64777. This is a random port that changes with each run. 

```
◈ No app server detected and no "command" specified
◈ Running static server from "src/site"
◈ Functions server is listening on 64777

◈ Server listening to 3999
```

Now we can access the hallo function on the command line:

```
$ curl localhost:64777/.netlify/functions/hallo
```

Now the function will stop in the debugger at our breakpoint. 

### Deploying Gatsby sites 

Warning: the "publish" directory was not set and will default to the repository root directory.
To publish the root directory, please set the "publish" directory to "/"
To publish the "base" directory instead, please set the "publish" directory to "jans-gatsby-site"
* gatsby site

set build output:

![Settings for deployment](https://github.com/jvermeir/netlify/blob/main/images/gatsbyDeploySettings.png "Settings for deployment")

to avoid

```
10:23:47 PM: Starting to deploy site from ''
10:23:49 PM: ​
10:23:49 PM: ────────────────────────────────────────────────────────────────
10:23:49 PM:   Configuration error                                           
10:23:49 PM: ────────────────────────────────────────────────────────────────
10:23:49 PM: ​
10:23:49 PM:   Error message
10:23:49 PM:   Deploy did not succeed: Invalid filename 'jans-gatsby-site/node_modules/es5-ext/array/#/compact.js'. Deployed filenames cannot contain # or ? characters
10:23:49 PM: ​
```

node_modules is not part of the site to be deployed but part of the temporary build output. The products of the build that are meant to be deployed are actually in the `public` folder.

# TODO


* deploy previews 
