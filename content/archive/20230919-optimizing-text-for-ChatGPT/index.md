---
title: 'Optimizing text for ChatGPT: NLP and text pre-processing techniques'
date: 2023-09-19T04:46:36-05:00
description: Mastering text preprocessing to send more input to ChatGPT.
categories: ["article"] 
aliases:
    - /archive/optimizing-text-for-chatgpt-nlp-and-text-pre-processing-techniques/
tags:
    - nlp
    - chatgpt
    - api
    - algorithms
    
    - compsci
    - data
    - python
 
draft: false
---

In order for chatbots and voice assistants to be helpful, they need to be able to take in and understand our instructions in plain language using Natural Language Processing (NLP). ChatGPT relies on a blend of advanced algorithms and text preprocessing methods to make sense of our words. But just throwing a wall of text at it can be inefficient -- you might be dumping in a lot of noise with that signal and hitting the text input limit.

Text preprocessing can help shorten and refine your input, ensuring that ChatGPT can grasp the essence without getting overwhelmed. In this article, we'll explore these techniques, understand their importance, and see how they make your interactions with tools like ChatGPT more reliable and productive.

## Text preprocessing

Text preprocessing prepares raw text data for analysis by NLP models. Generally, it distills everyday text (like full sentences) to make it more manageable or concise and meaningful. Techniques include:

- **Tokenization:** splitting up text by sentences or paragraphs. For example, you could break down a lengthy legal document into individual clauses or sentences.
- **Extractive summarization:** selecting key sentences from the text and discarding the rest. Instead of reading an entire 10-page document, extractive summarization could pinpoint the most crucial sentences and give you a concise overview without delving into the details.
- **Abstractive summarization:** generating a concise representation of the text content, for example, turning a 10-page document into a brief paragraph that captures the document's essence in new wording.
- **Pruning:** removing redundant or less relevant parts. For example, in a verbose email thread, pruning can help remove all the greetings, sign-offs, and other repetitive elements, leaving only the core content for analysis.

While all these techniques can help reduce the size of raw text data, some of these techniques are easier to apply to general use cases than others. Let's examine how text preprocessing can help us send a large amount of text to ChatGPT.

## Tokenization and ChatGPT input limits

In the realm of Natural Language Processing (NLP), a token is the basic unit of text that a system reads. At its simplest, you can think of a token as a word, but depending on the language and the specific tokenization method used, a token can represent a word, part of a word, or even multiple words.

While in English we often equate tokens with words, in NLP, the concept is broader. A token can be as short as a single character or as long as a word. For example, with word tokenization, the sentence "Unicode characters such as emojis are not indivisible. ✂️" can be broken down into tokens like this: ["Unicode", "characters", "such", "as", "emojis", "are", "not", "indivisible", ".", "✂️"]

In another form called Byte-Pair Encoding (BPE), the same sentence is tokenized as: ["Un", "ic", "ode", " characters", " such", " as", " em, "oj", "is", " are", " not", " ind", "iv", "isible", ".", " �", "�️"]. The emoji itself is split into tokens containing its underlying bytes.

Depending on the ChatGPT model chosen, your text input size is restricted by tokens. [Here are the docs containing current limits](https://platform.openai.com/docs/models). BPE is used by ChatGPT to determine token count, and we'll discuss it more thoroughly later. First, we can programmatically apply some preprocessing techniques to reduce our text input size and use fewer tokens.

## A general programmatic approach

For a general approach that can be applied programmatically, pruning is a suitable preprocessing technique. One form is **stop word removal,** or removing common words that might not add significant meaning in certain contexts. For example, consider the sentence:

"I always enjoy having pizza with my friends on weekends."

Stop words are often words that don't carry significant meaning on their own in a given context. In this sentence, words like "I", "always", "enjoy", "having", "with", "my", "on" are considered stop words.

After removing the stop words, the sentence becomes:

"pizza friends weekends."

Now, the sentence is distilled to its key components, highlighting the main subject (pizza) and the associated context (friends and weekends). If you find yourself wishing you could convince people to do this in real life (*cough*meetings*cough*)... you aren't alone.

Stop word removal is straightforward to apply programmatically: given a list of stop words, examine some text input to see if it contains any of the stop words on your list. If it does, remove them, then return the altered text.

```py
def clean_stopwords(text: str) -> str:
    stopwords = ["a", "an", "and", "at", "but", "how", "in", "is", "on", "or", "the", "to", "what", "will"]
    tokens = text.split()
    clean_tokens = [t for t in tokens if not t in stopwords]
    return " ".join(clean_tokens)
```

To see how effective stop word removal can be, I took the entire text of my [Tech Leader Docs newsletter](https://techleaderdocs.com) (17,230 words consisting of 104,892 characters) and processed it using the above function. How effective was it? The resulting text contained 89,337 characters, which is about a 15% reduction in size.

Other pruning techniques can also be applied programmatically. Removing punctuation, numbers, HTML tags, URLs and email addresses, or non-alphabetical characters are all valid pruning techniques that can be straightforward to apply. Here is a function that does just that:

```py
import re

def clean_text(text):
    # Remove URLs
    text = re.sub(r'http\S+', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove everything that's not a letter (a-z, A-Z)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove whitespace, tabs, and new lines
    text = ''.join(text.split())

    return text
```

What measure of length reduction might we be able to get from this additional processing? Applying these techniques to the remaining characters of Tech Leader Docs results in just 75,217 characters; an overall reduction of about 28% from the original text.

More opinionated pruning, such as removing short words or specific words or phrases, can be tailored to a specific use case. These don't lend themselves well to general functions, however.

Now that you have some text processing techniques in your toolkit, let's look at how a reduction in characters translates to fewer tokens used when it comes to ChatGPT. To understand this, we'll examine Byte-Pair Encoding.

## Byte-Pair Encoding (BPE)

Byte-Pair Encoding (BPE) is a subword tokenization method. It was originally introduced for data compression but has since been adapted for tokenization in NLP tasks. It allows representing common words as tokens and splits more rare words into subword units. This enables a balance between character-level and word-level tokenization.

Let's make that more concrete. Imagine you have a big box of LEGO bricks, and each brick represents a single letter or character. You're tasked with building words using these LEGO bricks. At first, you might start by connecting individual bricks to form words. But over time, you notice that certain combinations of bricks (or characters) keep appearing together frequently, like "th" in "the" or "ing" in "running."

BPE is like a smart LEGO-building buddy who suggests, "Hey, since 'th' and 'ing' keep appearing together a lot, why don't we glue them together and treat them as a single piece?" This way, the next time you want to build a word with "the" or "running," you can use these glued-together pieces, making the process faster and more efficient.

Colloquially, the BPE algorithm looks like this:

1. Start with single characters.
2. Observe which pairs of characters frequently appear together.
3. Merge those frequent pairs together to treat them as one unit.
4. Repeat this process until you have a mix of single characters and frequently occurring character combinations.

BPE is a particularly powerful tokenization method, especially when dealing with diverse and extensive vocabularies. Here's why:

- Handling rare words: Traditional tokenization methods might stumble upon rare or out-of-vocabulary words. BPE, with its ability to break words down into frequent subword units, can represent these words without needing to have seen them before.
- Efficiency: By representing frequent word parts as single tokens, BPE can compress text more effectively. This is especially useful for models like ChatGPT, where token limits apply.
- Adaptability: BPE is language-agnostic. It doesn't rely on predefined dictionaries or vocabularies. Instead, it learns from the data, making it adaptable to various languages and contexts.

In essence, BPE strikes a balance, offering the granularity of character-level tokenization and the context-awareness of word-level tokenization. This hybrid approach ensures that NLP models like ChatGPT can understand a wide range of texts while maintaining computational efficiency.

## Sending lots of text to ChatGPT

At time of writing, a message to ChatGPT via its web interface has a maximum token length of 4,096 tokens. If we assume the prior mentioned percent reduction as an average, this means you could reduce text of up to 5,712 tokens down to the appropriate size with just text preprocessing.

What about when this isn't enough? Beyond text preprocessing, larger input can be sent in chunks using the OpenAI API. In my next post, I'll show you how to build a Python module that does exactly that.
