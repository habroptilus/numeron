"""CPU class."""

from solver.utils import *
from itertools import permutations
from random import choice, shuffle


class Numeron_CPU():
    """CPU class."""

    def __init__(self, lamb=0):
        """Initialize."""
        self.candidates = ["".join(e)
                           for e in list(permutations(CHARS, DIGITS))]
        self.not_candidates = []
        self.lamb = lamb

    def update_candidates(self, num, j):
        """新しくコールした数字列と判定結果を用いて答え候補を更新する.

        :param num: str. 新しい答え.
        :param j: Judgement class.判定結果
        """
        self.candidates = [
            ans_cand for ans_cand in self.candidates if judge(ans_cand, num) == j]
        self.not_candidates += [
            ans_cand for ans_cand in self.candidates if judge(ans_cand, num) != j]
        return

    def call_num(self):
        """数字をコールする.

        :return: num(str)
        """
        scores_candidates = [self.lamb / len(self.candidates) + entropy(self.candidates, e)
                             for e in self.candidates]
        scores_not_candidates = [
            entropy(self.candidates, e) for e in self.not_candidates]
        combined_scores = scores_candidates + scores_not_candidates
        all_candidates = self.candidates + self.not_candidates
        return all_candidates[combined_scores.index(max(combined_scores))]
