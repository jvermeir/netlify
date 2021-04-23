# Netlify experiments

## Goals 

Learn how to use Netlify

## Basics 

### Set up a site to deploy from Github.

### Activate branch deploys

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

### Functions

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