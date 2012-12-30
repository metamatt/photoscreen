#! /usr/bin/env python
#
# (c) 2012 matt@ginzton.net

import sqlite3


class Database:
   def __init__(self):
      self.conn = sqlite3.connect('psdb.sqlite', check_same_thread = False)
      self.cursor = self.conn.cursor()

   def commit(self):
      self.conn.commit()

   def add_photo(self, path, thumb, digest):
      self.cursor.execute('INSERT INTO photos VALUES(?,?,?);', (digest, path, thumb))

   def enum_photos(self):
      self.cursor.execute('SELECT hash FROM photos')
      rows = self.cursor.fetchall()
      return [r[0] for r in rows]

   def get_photo_data(self, digest):
      self.cursor.execute('SELECT thumbnail FROM photos WHERE hash = ?', (digest,))
      thumb_data = self.cursor.fetchone()[0]
      return thumb_data


if __name__ == '__main__':
   import sys

   if sys.argv[1] == 'init':
      cmds = '''
         -- users
         CREATE TABLE users(name STRING PRIMARY KEY);
         INSERT INTO USERS VALUES('matt');
         
         -- photos
         CREATE TABLE photos(hash STRING PRIMARY KEY, filename STRING, thumbnail BLOB);
         
         -- ratings
         CREATE TABLE ratings(photo_hash STRING, user STRING, rating STRING);
      '''
      db = Database()
      db.cursor.executescript(cmds)
      db.commit()
