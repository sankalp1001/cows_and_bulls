import random
from wordfreq import top_n_list, zipf_frequency

# -------- Step 1: Get a large list of common English words --------
all_words = top_n_list('en', 50000)  # top 50k words by frequency

# -------- Step 2: Filter guessable words --------
def is_guessable(word, min_freq=3.0, max_freq=7.0):
    if not word.islower():
        return False
    return (
        len(word) == 4                 # exactly 4 letters
        and len(set(word)) == 4        # no repeating letters
        and word.isalpha()             # only alphabetic
        and min_freq <= zipf_frequency(word, 'en') <= max_freq  # must be common enough
    )

# Build dictionary: word -> zipf frequency
WORDS_FREQ = {w: zipf_frequency(w, 'en') for w in all_words if is_guessable(w)}
print(f'Total guessable words: {len(WORDS_FREQ)}')

# -------- Step 3: Save to file --------
with open("filtered_words_with_freq.txt", "w", encoding="utf-8") as f:
    for word, freq in sorted(WORDS_FREQ.items()):
        f.write(f"{word}\t{freq:.2f}\n")  # tab-separated

# -------- Step 4: Secret word selection function --------
def choose_secret_word(words_freq, min_freq=5.0, max_freq=7.0):
    """
    Picks a secret word from WORDS_FREQ within a frequency range.
    Adjust min_freq/max_freq to make game easier or harder.
    """
    candidates = [w for w, f in words_freq.items() if min_freq <= f <= max_freq]
    if not candidates:
        raise ValueError("No words found in the specified frequency range.")
    # print(f"Total secret candidates: {len(candidates)}")
    return random.choice(candidates)

# # -------- Step 5: Test secret word selection --------
# secret_word = choose_secret_word(WORDS_FREQ)
# print("Example secret word:", secret_word, "freq:", WORDS_FREQ[secret_word])

# # -------- Step 6: Show some sample words --------
# example_words = list(WORDS_FREQ.items())[:20]
# print("Sample guessable words:")
# for word, freq in example_words:
#     print(f"{word}: {freq:.2f}")
