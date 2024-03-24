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