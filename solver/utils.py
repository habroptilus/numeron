"""Utility用のクラスやメソッド."""

from collections import Counter
import math

CHARS = "0123456789"  # 使用できる文字の種類
DIGITS = 3  # 桁数


class Judgement():
    """Judgement Class."""

    def __init__(self, hit=0, bite=0):
        """Initialize.

        hit:位置も数字も同じである桁数
        bite:位置は違うけれど含まれてはいる個数
        """
        self.hit = hit
        self.bite = bite

    def __repr__(self):
        """表示用."""
        return "H{}B{}".format(self.hit, self.bite)

    def __eq__(self, other):
        """HitとBiteがそれぞれ等しければ等価.

        :param other: Judgement instance
        :return :boolean
        """
        return self.hit == other.hit and self.bite == other.bite

    def __ne__(self, other):
        """__eq__の逆.

        :param other: Judgement instance
        :return :boolean
        """
        return not(self.hit == other.hit and self.bite == other.bite)

    def __hash__(self):
        """Judgement classを辞書のキーにするために必要."""
        return int(str(self.hit) + "1000" + str(self.bite))


def judge(num1, num2):
    """二つの数字列を比較して判定を行う.

    :param num1,num2:str,str
    :return: Judgement
    """
    jg = Judgement()
    for i in range(DIGITS):
        for j in range(DIGITS):
            if num1[i] == num2[j]:
                if i == j:
                    jg.hit += 1
                else:
                    jg.bite += 1
    return jg


def is_valid_number(num):
    """入力として不適当な数字列かを判定する.

    :param num:str
    :return: boolean
    """
    if len(num) != DIGITS:
        return False
    else:
        for i in range(DIGITS):
            if num[i] not in CHARS:
                return False
            if num.count(num[i]) != 1:
                return False
    return True


def entropy(num_list, num):
    """コールした数字のエントロピーを計算する.

    :param num_list:list of str. 答えの候補のみ含む.
    :param num: str. コールした数字列.
    :return: entropy(float)
    """
    n = len(num_list)
    judges = [judge(cand, num) for cand in num_list]
    dicts = Counter(judges)
    prob = [v / n for v in dicts.values()]
    return sum([-p * math.log(p) for p in prob])
