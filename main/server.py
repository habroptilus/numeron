from flask import Flask, render_template, jsonify, request
from random import sample
app = Flask(__name__)


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
    for e in history:
        print("answer {}, judge {}".format(e["try"], e["judge"]))
    if len(history) == 0:
        ans = random_answer()
    else:
        pass  # cpuアルゴリズムによりansを決定
    response = jsonify({"answer": ans})
    response.status_code = 200
    return response


if __name__ == '__main__':
    app.run(debug=True)
