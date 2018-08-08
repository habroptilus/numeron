from flask import Flask, render_template, jsonify, request
from random import sample
from main import app
import sys
import os
sys.path.append(os.pardir)

from solver.cpu import Numeron_CPU
from solver.utils import *


def random_answer():
    chars = list("0123456789")
    return "".join(sample(chars, 3))


@app.route('/')
def root_url():
    return render_template('index.html')


@app.route('/api/json')
def api_json():
    history = request.args.get('history')
    history = eval(history)  # strで渡されるから、リストに変換
    if len(history) == 0:
        ans = random_answer()
    else:
        cpu_player = Numeron_CPU()
        for e in history:
            answer = "".join(list(map(str, e["try"])))
            j = Judgement(hit=e["judge"]["H"], bite=e["judge"]["B"])
            cpu_player.update_candidates(answer, j)
        ans = cpu_player.call_num()
    response = jsonify({"answer": ans})
    response.status_code = 200
    return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
