# Setting up ES (ElasticSearch)

## Import the data from snapshots into ES

Download the script from [this gist](https://gist.github.com/tiberiuichim/7453edda00b2c8eabeb8b8070f648e41) and name its file `es.py`, make it executable (`$ chmod u+x es.py`), then run:

```bash
$ sudo chown -R 105 snapshots/
$ ./es.py localhost init
$ ./es.py localhost set_replicas --replicas 0
$ ./es.py localhost view
$ ./es.py localhost restore --snapshot 14-11-2016-16-26
```

## Configuring Volto to be able to create functional DataCatalogue blocks

As used in the source code of volto-searchkit addon, it is not enough to use the URL in the block data. You must also set the `ELASTIC_URL` environment variable to `"http://esclient:9200"` before re/running `yarn start`.

When creating a new block you should use `"http://localhost:5000/"` as the URL for the ES server because we use that URL as a proxy.
