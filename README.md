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




### Set up Deploy Previews

What is this? 
