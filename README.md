# Netlify experiments

## Goals 

The purpose of this exercise is to show how Netlify can be used to support a development process. 
We would like to achieve the following goals:

1. Find out if a new commit can be successfully deployed.
1. Support testing by a group of people on a stable version of the site. 
1. Try out a version of the site in production to find out if version A or version B works better. 

### Getting Started 

Below I'll assume you've created an account on Netlify. You can do that using their free plan. For lack of inspiration, I named my team after myself.
![Netlify team](https://github.com/jvermeir/netlify/images/TeamSetup.png "Team Setup").

### Set up a site to deploy from Github.

One of the nice features of Netlify is its smooth integration with Git repositories like GitHub. I've granted Netlify permission to access this repository, so it can deploy changes automatically.

Details can be found here: ![Netlify repository permissions](https://docs.netlify.com/configure-builds/repo-permissions-linking/ "Netlify repository permissions").
In summary:

1. Select the `sites` tab, then the `New site from Git` button.
1. This will pop up a new window from GitHub asking to grant permissions to Netlify. This enables the Netlify integration with GitHub. 
1. Now you need to grant permissions for each repository you wish to deploy with Netlify. This can be done with the '`configure Netlify on GitHub'` button.
   ![Configure Netlify on GitHub](https://github.com/jvermeir/netlify/images/NetlifyOnGitHubConfig.png "Configure Netlify on GitHub").
1. This pops up a new window allowing you to configure Netlify's permissions on GitHub. I've given Netlify permissions to deploy this repository only (https://github.com/jvermeir/netlify).
1. You can check the configuration on GitHub by accessing `applications` in your account settings.
![GitHub account settings](https://github.com/jvermeir/netlify/images/NetlifyOnGitHubConfig.png "GitHub account settings")

### Automated deployment

With the configuration above in place, we can now enable automated deployment for each commit to the main branch. The third tab of the `New site from Git` allows selecting a branch to deploy and the configuration of the build and deploy itself.
In my case there's no more than and index.html file in the public folder, so I set the `Base directory` property to `public`. 

### Branch Deploys

Branch deploys are useful for 
go to settings/build&deploy/Deploy contexts

https://app.netlify.com/sites/<your site here>/settings/deploys#continuous-deployment

select branches to be deployed. 

### Set up A/B testing 

Called 'Split Testing' by Netlify.
Active branch deploys first.
Create a branch named branchA. Update index.html to show we're on A. Branch gets deployed next to main branch deployment.

Access branch site on https://brancha--sad-sammet-2a9b52.netlify.app/
Access main branch on https://main--sad-sammet-2a9b52.netlify.app/
Access site on https://sad-sammet-2a9b52.netlify.app/

so curl https://sad-sammet-2a9b52.netlify.app/ will now alternate between main and branchA 

Create a branch named branchB. Update index.html to show we're on B.
Add branchB on the split testing page and drag the slider to 33%. 

Run `./test.sh`. The script curls to https://sad-sammet-2a9b52.netlify.app/ every couple seconds and show it returns one of the three versions. 
Super easy. 

### Set up Deploy Previews

Netlify can deploy a new version when a pull request is started on GitHub. To activate go to settings/build and deploy/deploy contexts.
Activate Deploy Previews. Now start a new branch, make change and push. In GitHub, start a pull request.
GitHub UI will now show the deployment to Netlify in progress. 
Move back to Netlify's deploy tab and click the link for 'Deploy Preview #1'. This will open a browser with a link to the new deployment. 


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