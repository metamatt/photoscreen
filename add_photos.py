#! /usr/bin/env python
#
# (c) 2012 matt@ginzton.net

# system libs
import hashlib
import os
import StringIO
import sys
# public libs
import Image
# private libs
import database


db = database.Database()
size = (400, 400)
count = 0

for photo_file_path in sys.argv[1:]:
   # get full path
   path = os.path.realpath(photo_file_path)

   # get thumbnail
   im = Image.open(photo_file_path)
   im.thumbnail(size, Image.ANTIALIAS)
   #thumb = buffer(im.tostring('jpeg'))
   stringbuf = StringIO.StringIO()
   im.save(stringbuf, 'JPEG')
   thumb = buffer(stringbuf.getvalue())

   # get content hash
   with open(photo_file_path, 'rb') as contents:
      digester = hashlib.sha1()
      while True:
         buf = contents.read(4096)
         if not buf:
            break
         digester.update(buf)
      digest = digester.hexdigest()

   # add to database
   print 'adding %s (%d KB)' % (photo_file_path, len(thumb) / 1024)
   db.add_photo(path, thumb, digest)
   count += 1

db.commit()
print 'added %d photos' % count
