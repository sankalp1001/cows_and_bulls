from wordfreq import top_n_list, zipf_frequency

# -------- Step 1: Get a large list of common English words --------
all_words = top_n_list('en', 50000)  # top 50k words by frequency

# -------- Step 2: Filter according to your game rules --------
def is_valid_word(word):
    word = word.lower()
    return (
        len(word) == 4                 # exactly 4 letters
        and word[-1] != 's'             # not plural
        and len(set(word)) == 4         # no repeating letters
        and zipf_frequency(word, 'en') > 3.5  # common enough
        and word.islower()              # avoid proper nouns (capitalized)
        and word.isalpha()              # only alphabetic characters
    )
filtered_words = [w for w in all_words if is_valid_word(w)]

# -------- Step 3: Save --------
with open("filtered_words.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(sorted(filtered_words)))

# -------- Step 4: Debugging --------
print(f'Total filtered words: {len(filtered_words)}')
print(f'Example words: {filtered_words[:20]}')
print(f'"oval" in filtered_words: {"oval" in filtered_words}')
print(f'Zipf frequency of "oval": {zipf_frequency("oval", "en")}')
