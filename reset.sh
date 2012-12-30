#! /bin/sh

rm psdb.sqlite
python database.py init
find ~/Pictures/iPhoto\ Library.photolibrary/Previews/2012/12/11 -type f -print0 | xargs -0 python add_photos.py
