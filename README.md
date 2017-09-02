

<!-- toc -->

- [Node.js sample app on OpenShift!](#nodejs-sample-app-on-openshift)
  * [OpenShift Origin v3 setup](#openshift-origin-v3-setup)
    + [Running a virtual machine with Vagrant](#running-a-virtual-machine-with-vagrant)
    + [Starting a Docker container](#starting-a-docker-container)
    + [Downloading the Binary](#downloading-the-binary)
    + [Running an Ansible playbook](#running-an-ansible-playbook)
  * [Creating a project](#creating-a-project)
  * [Creating new apps](#creating-new-apps)
    + [Create a new app from source code (method 1)](#create-a-new-app-from-source-code-method-1)
    + [Create a new app from a template (method 2)](#create-a-new-app-from-a-template-method-2)
    + [Build the app](#build-the-app)
    + [Deploy the app](#deploy-the-app)
    + [Configure routing](#configure-routing)
    + [Create a new app from an image (method 3)](#create-a-new-app-from-an-image-method-3)
    + [Setting environment variables](#setting-environment-variables)
    + [Success](#success)
    + [Pushing updates](#pushing-updates)
  * [Debugging](#debugging)
  * [Web UI](#web-ui)
  * [Looking for help](#looking-for-help)
  * [Compatibility](#compatibility)
  * [License](#license)

<!-- tocstop -->

## Node.js sample app on OpenShift!
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

Outlined as the [Advanced Installation](https://docs.openshift.org/latest/install_config/install/advanced_install.html) method for poduction environments, OpenShift Origin is also installable via Ansible playbook made avaialble on the GitHub [openshift-ansible](https://github.com/openshift/openshift-ansible) repo.


### Creating a project

After logging in with `oc login` (default username/password: openshift), if you don't have a project setup all ready, go ahead and take care of that:

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

Looking at the repo, you'll notice three files in the openshift/template directory:

	nodejs-ex
	├── openshift
	│   └── templates
	│       ├── nodejs.json
	│       ├── nodejs-mongodb.json
	│       └── nodejs-mongodb-persistent.json
	├── package.json
	├── README.md
	├── server.js
	├── tests
	│   └── app_test.js
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

        svc/nodejs-ex - 172.30.108.183:8080
          dc/nodejs-ex deploys istag/nodejs-ex:latest <-
            bc/nodejs-ex builds https://github.com/openshift/nodejs-ex with openshift/nodejs:0.10
              build #1 running for 7 seconds
            deployment #1 waiting on image or update

Note the server address for the web console, as yours will likely differ if you're not using the Vagrant set-up. You can follow along with the web console to see what new resources have been created and watch the progress of builds and deployments.

If the build is not yet started (you can check by running `oc get builds`), start one and stream the logs with:

        $ oc start-build nodejs-ex --follow

You can alternatively leave off `--follow` and use `oc logs build/nodejs-ex-n` where *n* is the number of the build to track the output of the build.

#### Deploy the app

Deployment happens automatically once the new application image is available.  To monitor its status either watch the web console or execute `oc get pods` to see when the pod is up.  Another helpful command is

        $ oc get svc

This will help indicate what IP address the service is running, the default port for it to deploy at is 8080. Output should look like:

        NAME        CLUSTER-IP       EXTERNAL-IP   PORT(S)    SELECTOR                                AGE
        nodejs-ex   172.30.249.251   <none>        8080/TCP   deploymentconfig=nodejs-ex,name=myapp   17m

#### Configure routing

An OpenShift route exposes a service at a host name, like www.example.com, so that external clients can reach it by name.

DNS resolution for a host name is handled separately from routing; you may wish to configure a cloud domain that will always correctly resolve to the OpenShift router, or if using an unrelated host name you may need to modify its DNS records independently to resolve to the router.

That aside, let's explore our new web console, which for our example is running at [https://10.2.2.2:8443](https://10.2.2.2:8443).

After logging into the web console with your same CLI `oc login` credentials, click on the project we just created, then click `Create route`.

If you're running OpenShift on a local machine, you can preview the new app by setting the Hostname to a localhost like: *10.2.2.2*.

This could also be accomplished by running:

        $ oc expose svc/nodejs-ex --hostname=www.example.com

Now navigate to the newly created Node.js web app at the hostname we just configured, for our example it was simply [https://10.2.2.2](https://10.2.2.2).

#### Create a new app from an image (method 3)

You may have noticed the index page "Page view count" reads "No database configured". Let's fix that by adding a MongoDB service. We could use the second OpenShift template example (`nodejs-mongodb.json`) but for the sake of demonstration let's point `oc new-app` at a DockerHub image:

        $ oc new-app centos/mongodb-26-centos7 \
        $ -e MONGODB_USER=admin,MONGODB_DATABASE=mongo_db,MONGODB_PASSWORD=secret,MONGODB_ADMIN_PASSWORD=super-secret

The `-e` flag sets the environment variables we want used in the configuration of our new app.

Running `oc status` or checking the web console will reveal the address of the newly created MongoDB:

	In project nodejs-echo on server https://10.2.2.2:8443

	svc/mongodb-26-centos7 - 172.30.0.112:27017
	  dc/mongodb-26-centos7 deploys istag/mongodb-26-centos7:latest
	    deployment #1 running for 43 seconds - 1 pod

	http://10.2.2.2 to pod port 8080-tcp (svc/nodejs-ex)
	  dc/nodejs-ex deploys istag/nodejs-ex:latest <-
	    bc/nodejs-ex builds https://github.com/openshift/nodejs-ex with openshift/nodejs:0.10
	    deployment #1 deployed 14 minutes ago - 1 pod

Note that the url for our new Mongo instance, for our example, is `172.30.0.112:27017`, yours will likely differ.

#### Setting environment variables

To take a look at environment variables set for each pod, run `oc env pods --all --list`.

We need to add the environment variable `MONGO_URL` to our Node.js web app so that it will utilize our MongoDB, and enable the "Page view count" feature. Run:

        $ oc set env dc/nodejs-ex MONGO_URL='mongodb://admin:secret@172.30.0.112:27017/mongo_db'

Then check `oc status` to see that an updated deployment has been kicked off:

	In project nodejs-echo on server https://10.2.2.2:8443

	svc/mongodb-26-centos7 - 172.30.0.112:27017
	  dc/mongodb-26-centos7 deploys istag/mongodb-26-centos7:latest
	    deployment #1 deployed 2 hours ago - 1 pod

	http://10.2.2.2 to pod port 8080-tcp (svc/nodejs-ex)
	  dc/nodejs-ex deploys istag/nodejs-ex:latest <-
	    bc/nodejs-ex builds https://github.com/openshift/nodejs-ex with openshift/nodejs:0.10
	    deployment #2 deployed about a minute ago - 1 pod
	    deployment #1 deployed 2 hours ago

#### Success

You should now have a Node.js welcome page showing the current hit count, as stored in a MongoDB database.

#### Pushing updates

Assuming you used the URL of your own forked repository, we can easily push changes and simply repeat the steps above which will trigger the newly built image to be deployed.

### Debugging

Review some of the common tips and suggestions [here](https://github.com/openshift/origin/blob/master/docs/debugging-openshift.md).

### Web UI

To run this example from the Web UI, you can same steps following done on the CLI as defined above. Here's a video showing it in motion:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=uocucZqg_0I&t=225" target="_blank">
<img src="http://img.youtube.com/vi/uocucZqg_0I/0.jpg"
alt="OpenShift 3: Node.js Sample" width="240" height="180" border="10" /></a>

### Looking for help

If you get stuck at some point, or think that this document needs further details or clarification, you can give feedback and look for help using the channels mentioned in [the OpenShift Origin repo](https://github.com/openshift/origin), or by filing an issue.

### Compatibility

This repository is compatible with Node.js 4 and higher, excluding any alpha or beta versions.

### License

This code is dedicated to the public domain to the maximum extent permitted by applicable law, pursuant to [CC0](http://creativecommons.org/publicdomain/zero/1.0/).
