# disqus api

Crawl from a Disqus forum into mongodb collection - and web client to search.

Need to have a Disqus API KEY

Create a config file `.env.prod` by looking at `.env`

Crawl
```sh
npm run crawler --forum=test --sleepms=7000
```

Run client
```sh
npm run prod
```

# Container
```sh
# build
docker build --label disqus-search --tag disqus-search .

# network to connecto to mongodb container
docker network create disqusNetwork
docker network connect disqusNetwork mongo_disqus

# now inspect to get ip of mongo container to put in .env file
docker network inspect disqusNetwork

# run - LIBPATHS in .env file must be relative to /data
docker run --env-file .env.prod -d --rm -p 5000:5000 --name disqus-search-container disqus-search

docker network connect disqusNetwork disqus-search-container
```
