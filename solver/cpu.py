"""CPU class."""

from utils import *
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


if __name__ == "__main__":
    player = Numeron_CPU(lamb=0)
    answer = input("答えを入力:")
    turn = 1
    if is_valid_number(answer):
        while True:
            if turn == 10:
                break
            print("Turn{}".format(turn))
            if turn == 1:
                call = choice(player.candidates)
            else:
                call = player.call_num()
            print(call)
            print(len(player.candidates))
            j = judge(call, answer)
            if j == Judgement(hit=3, bite=0):
                print("Clear! turn{}".format(turn))
                break
            player.update_candidates(call, j)
            turn += 1
    else:
        print("Invalid Number.")
