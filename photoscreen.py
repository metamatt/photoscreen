#! /usr/bin/env python
#
# (c) 2012 matt@ginzton.net

# system libs
import sqlite3
import threading
# public libs
import flask
# private libs
import database


app = flask.Flask(__name__)
db = database.Database()
render_template = flask.render_template

@app.route('/')
def root():
   return render_template('client.html')

@app.route('/api/photos')
def api_photos_enum():
   photos = db.enum_photos()
   #return '\n'.join(photos)
   return flask.jsonify(list=photos)

@app.route('/api/photos/<digest>')
def api_photos_get(digest):
   thumb_data = db.get_photo_data(digest)
   return flask.Response(thumb_data, content_type = 'image/jpeg')

def start():
   app.run(debug = True)

start()
