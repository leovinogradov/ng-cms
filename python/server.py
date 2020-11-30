from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
import api

def test():
    print('hello I am a print')

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

@app.route('/')
def hello():
    app.logger.info('testing info log')
    return "Hello World!"

@app.route('/elements', methods=['GET'])
def getElements():
    with open('./references/elements.json') as f:
        # contents = f.read()
        data = json.load(f)
        return jsonify(data)


@app.route('/insert', methods=['POST'])
def insert():
    # app.logger.info('request.json:', request.json)
    # app.logger.info('request.values:\n', request.values)
    # print('request.values:\n', request.values)
    data = request.get_json()
    print('json data', type(data), data);

    api.insert(data)

    return jsonify({ 'success': True })

if __name__ == '__main__':
    app.run()
