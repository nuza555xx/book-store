#!/bin/bash

curl -X POST "elastic:root@localhost:9200/content,member,setting-point,transaction/_delete_by_query?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  }
}'