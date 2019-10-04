# API responses comparator

This tool enables you to programmatically compare APIs responses, to discover if there is any difference between the responses' body. 

## How to get started?
- Create `RESPONSES_OUTPUT_FOLDER` and `DIFFERENCES_OUTPUT_FOLDER` folders
- Create your own `.env` file within the project root with your configuration value (duplicate and rename `.env.example`)
- Create you `./input/urls.csv` file as a CSV file with `url` column: do not specify the domain of your API, but only the path. See below for example
- Run the `npm run fetch:master` script to fetch the master API responses. This responses will be used within the comparison as the reference reponses against which to find differences
- Run the `npm run compare script` to start fetching the responses from the secondary API and compare the responses against the master API
- In case of any difference between master and secondary API, the difference will be reported within the specified output folder. Differences will be expressed according to the [`deep-diff`](https://www.npmjs.com/package/deep-diff) syntax 


## `./input/urls.csv` example
```
url
/capture-species/CHN/1653/1980  
```
Note that no domain is included, but only the final path of the URL.

