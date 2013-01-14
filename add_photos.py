#! /usr/bin/env python
#
# (c) 2012 matt@ginzton.net

# system libs
import hashlib
import os
import StringIO
import subprocess
import sys
import traceback
# public libs
import Image
# private libs
import database


db = database.Database()
size = (400, 400)
count = 0


class NotAnImageError(Exception):
   pass

for photo_file_path in sys.argv[1:]:
   try: # wrap loop in exception handler so if one file fails, we keep going
      # get full path
      path = os.path.realpath(photo_file_path)

      # get thumbnail: read image and resize to 400x400
      # hack for raw files: read JPEG files directly with PIL; all others get piped through dcraw
      extension = os.path.splitext(photo_file_path)[1][1:].upper()
      try:
         if extension in ('JPG', 'JPEG', 'PNG'):
            im = Image.open(photo_file_path)
         else:
            bytes = subprocess.check_output(['dcraw', '-h', '-c', photo_file_path], stderr = subprocess.STDOUT)
            im = Image.open(StringIO.StringIO(bytes))
      except subprocess.CalledProcessError, IOError:
         raise NotAnImageError
      im.thumbnail(size, Image.ANTIALIAS)
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
   except NotAnImageError:
      print 'skipping %s (not an image file)' % photo_file_path
   except KeyboardInterrupt:
      raise
   except: # keep going on other exceptions
      traceback.print_exc(0)

db.commit()
print 'added %d photos' % count
