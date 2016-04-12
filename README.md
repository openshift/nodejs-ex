Node.js sample app on OpenShift!
-----------------

This example will serve a welcome page and the current hit count as stored in a database.

### OpenShift Origin v3 setup

There are four methods to get started with OpenShift v3: 

  - Running a virtual machine with Vagrant
  - Starting a Docker container
  - Downloading the binary
  - Running an Ansible playbook

#### Running a virtual machine with Vagrant

One option is to use the Vagrant all-in-one launch as described in the [OpenShift Origin All-In-One Virtual Machine](https://www.openshift.org/vm/). This option works on Mac, Windows and Linux, but requires that you install [Vagrant](https://www.vagrantup.com/downloads.html) running [VirtualBox](https://www.virtualbox.org/wiki/Downloads).

#### Starting a Docker container

Another option is running the OpenShift Origin Docker container image from [Docker Hub](https://hub.docker.com/r/openshift/origin/) launch as described in the [Getting Started for Administrators](https://docs.openshift.org/latest/getting_started/administrators.html#running-in-a-docker-container). This method is supported on Fedora, CentOS, and Red Hat Enterprise Linux (RHEL) hosts only.

#### Downloading the Binary

Red Hat periodically publishes OpenShift Origin Server binaries for Linux, which you can download on the OpenShift Origin GitHub [Release](https://github.com/openshift/origin/releases) page. Instructions on how to install and launch the Openshift Origin Server from binary are described in [Getting Started for Administrators](https://docs.openshift.org/latest/getting_started/administrators.html#downloading-the-binary).

#### Running an Ansible playbook

Outlined as the [Advanced Intallation](https://docs.openshift.org/latest/install_config/install/advanced_install.html) method for poduction environments, OpenShift Origin is also installable via Ansible playbook made avaialble on the GitHub [openShift-ansible](https://github.com/openshift/openshift-ansible) repo.


### Creating a project

After logging in with `oc login` (default username/password: openshift), if you don't have a project setup all ready, go ahead and take care of that

        $ oc new-project nodejs-echo \
        $ --display-name="nodejs" --description="Sample Node.js app"

That's it, project has been created.  Though it would probably be good to set your current project to this (thought new-project does it automatically as well), such as:

        $ oc project nodejs-echo

### Creating new apps

You can create a new OpenShift application using the web console or by running the `oc new-app` command from the CLI. With the  OpenShift CLI there are three ways to create a new application, by specifying either: 

- [source code](https://docs.openshift.com/enterprise/3.0/dev_guide/new_app.html#specifying-source-code)
- [OpenShift templates](https://docs.openshift.com/enterprise/3.0/dev_guide/new_app.html#specifying-a-template)
- [DockerHub images](https://docs.openshift.com/enterprise/3.0/dev_guide/new_app.html#specifying-an-image)

#### Create a new app from source code (method 1)

Pointing `oc new-app` at source code kicks off a chain of events, for our example run:

        $ oc new-app https://github.com/openshift/nodejs-ex -l name=myapp

The tool will inspect the source code, locate an appropriate image on DockerHub, create an ImageStream for that image, and then create the right build configuration, deployment configuration and service definition.  

(The -l flag will apply a label of "name=myapp" to all the resources created by new-app, for easy management later.)

#### Create a new app from a template (method 2)

We can also [create new apps using OpenShift template files](https://docs.openshift.com/enterprise/3.0/dev_guide/new_app.html#specifying-a-template). Clone the demo app source code from [GitHub repo](https://github.com/openshift/nodejs-ex) (fork if you like).

        $ git clone https://github.com/openshift/nodejs-ex
        
Looking at the repo, you'll notice two files in the openshift/template directory:

	nodejs-ex
	├── README.md
	├── openshift
	│   └── templates
	│       ├── nodejs-mongodb.json
	│       └── nodejs.json
	├── package.json
	├── server.js
	└── views
	    └── index.html
	    
We can create the the new app from the `nodejs.json` template by using the `-f` flag and pointing the tool at a path to the template file:

        $ oc new-app -f /path/to/nodejs.json
        
#### Build the app

`oc new-app` will kick off a build once all required dependencies are confirmed. 

Check the status of your new nodejs app with the command:

        $ oc status

Which should return something like:

        In project nodejs (nodejs-echo) on server https://10.2.2.2:8443

Note the address, as yours may differ. This is the address for the web GUI console. You can follow along with the web console to see what new resources have been created and watch the progress of builds and deployments.

If the build is not yet started (you can check by running `oc get builds`), start one and stream the logs with:

        $ oc start-build nodejs-ex --follow

You can alternatively leave off `--follow` and use `oc logs nodejs-ex-n` where *n* is the number of the build to track the output of the build.

#### Deploy the app

Deployment happens automatically once the new application image is available.  To monitor its status either watch the web console or execute `oc get pods` to see when the pod is up.  Another helpful command is

        $ oc get svc

This will help indicate what IP address the service is running, the default port for it to deploy at is 8080. Output should look like:

        NAME        CLUSTER-IP       EXTERNAL-IP   PORT(S)    SELECTOR                                AGE
        nodejs-ex   172.30.249.251   <none>        8080/TCP   deploymentconfig=nodejs-ex,name=myapp   17m

#### Configure routing

An OpenShift route exposes a service at a host name, like www.example.com, so that external clients can reach it by name.

DNS resolution for a host name is handled separately from routing; your administrator may have configured a cloud domain that will always correctly resolve to the OpenShift router, or if using an unrelated host name you may need to modify its DNS records independently to resolve to the router.

As of OpenShift v3.1 routes can be configured in the web console or via CLI. Using the CLI, you can expose a route as follows:

        $ oc expose service/<name> --hostname=<www.example.com>

If you're running OpenShift on a local machine, you can preview the new app by setting a local route like:

        $ oc expose service/nodejs-ex --hostname=10.2.2.2

#### Create a new app from an image (method 3) 

You may have noticed the home page "Page view count" reads "No database configured". Let's fix that by adding a MongoDB service. We could use the second OpenShift template example (`nodejs-mongodb.json`) but for the sake of demonstration let's point `oc new-app` at a DockerHub image:

        $ oc new-app centos/mongodb-26-centos7 \
        $ -e MONGODB_USER=admin,MONGODB_DATABASE=mongo_db,MONGODB_PASSWORD=secret,MONGODB_ADMIN_PASSWORD=super-secret
        
The `-e` flag sets the environment variables we want used in the configuration of our new app.

Running `oc status` will reveal the address of the newly created MongoDB:

        In project nodejs (nodejs-echo) on server https://10.2.2.2:8443

        http://10.2.2.2 to pod port 8080-tcp (svc/nodejs-ex)
          dc/nodejs-ex deploys istag/nodejs-ex:latest <-
            bc/nodejs-ex builds https://github.com/openshift/nodejs-ex with openshift/nodejs:0.10
            deployment #1 deployed 12 minutes ago - 1 pod

        svc/mongodb-26-centos7 - 172.30.201.71:27017
          dc/mongodb-26-centos7 deploys istag/mongodb-26-centos7:latest
            deployment #1 deployed 2 minutes ago - 1 pod


Remove all the nodejs-ex resources with the label "name=myapp".

        $ oc delete all -l name=myapp

Recreate the nodejs service again, but this time specifying the MONGO_URL environment variable:

        $ oc new-app https://github.com/openshift/nodejs-ex -l name=myapp \
        $ -e MONGO_URL=mongodb://admin:secret@172.30.201.71:27017/mongo_db

#### Success

This example will serve a welcome page and the current hit count as stored in a database to [http://10.2.2.2](http://10.2.2.2).

#### Pushing updates

Assuming you used the URL of your own forked report, we can easily push changes to that hosted repo and simply repeat the steps above to build which will trigger the new built image to be deployed.

### Debugging

Review some of the common tips and suggestions [here](https://github.com/openshift/origin/blob/master/docs/debugging-openshift.md).

### Web UI

To run this example from the Web UI, you can same steps following done on the CLI as defined above by [The project](#the-project). Here's a video showing it in motion:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=uocucZqg_0I&t=225" target="_blank">
<img src="http://img.youtube.com/vi/uocucZqg_0I/0.jpg"
alt="OpenShift 3: Node.js Sample" width="240" height="180" border="10" /></a>
