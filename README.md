Node.js sample app on OpenShift!
-----------------

This example will serve a welcome page and the current hit count as stored in a database to [http://host:8080](http://host:8080).

### OpenShift setup ###

One option is to use the Docker all-in-one launch as described in the [OpenShift Origin project](https://github.com/openshift/origin).

### The project ###

After logging in with `oc login`, if you don't have a project setup all ready, go ahead and take care of that

        $ oc new-project nodejs-echo --display-name="nodejs" --description="Sample Node.js app"

That's it, project has been created.  Though it would probably be good to set your current project to this (thought new-project does it automatically as well), such as:

        $ oc project nodejs-echo

### The app ###

Now let's pull in the app source code from [GitHub repo](https://github.com/openshift/nodejs-ex) (fork if you like).

#### create ####

        $ oc new-app https://github.com/openshift/nodejs-ex -l name=myapp
        
That should be it, this form of `new-app` will locate an appropriate image on DockerHub, create an ImageStream for that image, and then create the right build configuration, deployment configuration and service definition.  Next you'll be able to kick off the build, though new-app will kick off a build once all required dependencies are confirmed.  The -l flag will apply a label of "name=myapp" to all the resources created by new-app, for easy management later.

Note, you can follow along with the web console (located at https://ip-address:8443/console) to see what new resources have been created and watch the progress of the build and deployment.

#### build ####

If the build is not started (you can check by running "oc get builds"), start one and stream the logs with:

        $ oc start-build nodejs-ex --follow

You can alternatively leave off `--follow` and use `oc build-logs nodejs-ex-n` where n is the number of the build to track the output of the build.

#### deploy ####

Deployment happens automatically once the new application image is available.  To monitor its status either watch the web console or execute `oc get pods` to see when the pod is up.  Another helpful command is

        $ oc status

This will help indicate what IP address the service is running, the default port for it to deploy at is 8080.  

#### enjoy ####

Determine the service ip for the application by running

		$ oc get svc

Run/test your app by browsing to

        $ curl service-ip-address:8080

#### update ####

Assuming you used the URL of your own forked report, we can easily push changes to that hosted repo and simply repeat the steps above to build which will trigger the new built image to be deployed.

#### delete ####

		$ oc delete all -l name=myapp

To remove all the resources with the label "name=myapp".

###Debugging Unexpected Failures

Review some of the common tips and suggestions [here](https://github.com/openshift/origin/blob/master/docs/debugging-openshift.md).


### Web UI ###

To run this example from the Web UI, you can same steps following done on the CLI as defined above by [The project](#the-project). Here's a video showing it in motion:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=uocucZqg_0I&t=225" target="_blank">
<img src="http://img.youtube.com/vi/uocucZqg_0I/0.jpg" 
alt="OpenShift 3: Node.js Sample" width="240" height="180" border="10" /></a>

