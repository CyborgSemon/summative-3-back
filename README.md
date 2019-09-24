# Summative 3 Back End

### Ensure that you have NPM and Node.js installed on your computer
To get set up, clone or download the repo, then rename the `configExample.json` file to `config.json`.

For this project to work, you will have to set up a cluster in [MongoDB](https://www.mongodb.com/). It is free to set up a small cluster which will be prefect for running this app. Once your cluster is made, make a remote user for the cluster and put their credentials in `config.json` file.

This is an example of what your `config.json` file should look something like:
```json
{
	"MONGO_USERNAME": "USERNAME",
	"MONGO_PASSWORD": "PASSWORD",
	"CLUSTER_NAME": "CLUSTER12345-ABCD",
	"TABLE_NAME": "PROJECT_NAME"
}
```

Once that is done, open the root folder up in terminal and type:

```sh
npm install
node server.min
```

This should get the back end all set up.
Check out the [front end repo](https://github.com/CyborgSemon/summative-3-front) README.md to set up the front end part of this project.
