"""CPU class."""

from solver.utils import *
from itertools import permutations
from random import choice, shuffle


class Numeron_CPU():
    """CPU class."""

    def __init__(self):
        """Initialize."""
        self.candidates = ["".join(e)
                           for e in list(permutations(CHARS, DIGITS))]

    def update_candidates(self, num, j):
        """新しくコールした数字列と判定結果を用いて答え候補を更新する.

        :param num: str. 新しい答え.
        :param j: Judgement class.判定結果
        """
        self.candidates = [
            ans_cand for ans_cand in self.candidates if judge(ans_cand, num) == j]
        return

    def call_num(self):
        """数字をコールする.

        :return: num(str)
        """
        scores = [entropy(self.candidates, e)
                  for e in self.candidates]
        return self.candidates[scores.index(max(scores))]
