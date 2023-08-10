#!/bin/sh

# Credits: http://stackoverflow.com/a/750191

git filter-branch -f --env-filter "
    GIT_AUTHOR_NAME='winzlieb'
    GIT_AUTHOR_EMAIL='winzlieb@c3d2.de'
    GIT_COMMITTER_NAME='winzlieb'
    GIT_COMMITTER_EMAIL='winzlieb@c3d2.de'
  " HEAD