---
title: 'How to send long text input to ChatGPT using the OpenAI API'
date: 2023-09-26T04:46:36-05:00
description: A straightforward guide to sending large input to ChatGPT using Python.
categories: ["article"] 
aliases:
    - /blog/how-to-send-long-text-input-to-chatgpt-using-the-openai-api/
tags:
    
    
    
    - algorithms
    
    - compsci
    - data
    - python
 
draft: false
---

In a previous post, I showed how you can apply text preprocessing techniques to shorten your input length for ChatGPT. Today in the web interface ([chat.openai.com](https://chat.openai.com/)), ChatGPT allows you to send a message with a maximum token length of 4,096.

There are bound to be situations in which this isn't enough, such as when you want to read in a large amount of text from a file. Using the OpenAI API allows you to send many more tokens in a messages array, with the maximum number depending on your chosen model. This lets you provide large amounts of text to ChatGPT using chunking. Here's how.

## Chunking your input

The `gpt-4` model currently has a maximum content length token limit of 8,192 tokens. ([Here are the docs containing current limits for all the models](https://platform.openai.com/docs/models).) Remember that you can first apply text preprocessing techniques to reduce your input size -- in my [previous post](/posts/optimizing-text-for-chatgpt-nlp-and-text-pre-processing-techniques/) I achieved a 28% size reduction without losing meaning with just a little tokenization and pruning.

When this isn't enough to fit your message within the maximum message token limit, you can take a general programmatic approach that sends your input in message chunks. The goal is to divide your text into sections that each fit within the model's token limit. The general idea is to:

1. **Tokenize and split text into chunks** based on the model's token limit. It's better to keep message chunks slightly below the token limit since the token limit is shared between your message and ChatGPT's response.
2. **Maintain context** between chunks, e.g. avoid splitting a sentence in the middle.

Each chunk is sent as a separate message in the conversation thread.

## Handling responses

You send your chunks to ChatGPT using the OpenAI library's `ChatCompletion`. ChatGPT returns individual responses for each message, so you may want to process these by:

1. **Concatenating responses** in the order you sent them to get a coherent answer.
2. **Manage conversation flow** by keeping track of which response refers to which chunk.
3. **Formatting the response** to suit your desired output, e.g. replacing `\n` with line breaks.

## Putting it all together

Using the OpenAI API, you can send multiple messages to ChatGPT and ask it to wait for you to provide all of the data before answering your prompt. Being a language model, you can provide these instructions to ChatGPT in plain language. Here's a suggested script:

> Prompt: Summarize the following text for me
>
> To provide the context for the above prompt, I will send you text in parts. When I am finished, I will tell you "ALL PARTS SENT". Do not answer until you have received all the parts.

I created [a Python module, `chatgptmax`](https://github.com/victoriadrake/chatgptmax), that puts all this together. It breaks up a large amount of text by a given maximum token length and sends it in chunks to ChatGPT.

You can install it with `pip install chatgptmax`, but here's the juicy part:

```py
import os
import openai
import tiktoken

# Set up your OpenAI API key
# Load your API key from an environment variable or secret management service
openai.api_key = os.getenv("OPENAI_API_KEY")

def send(
    prompt=None,
    text_data=None,
    chat_model="gpt-3.5-turbo",
    model_token_limit=8192,
    max_tokens=2500,
):
    """
    Send the prompt at the start of the conversation and then send chunks of text_data to ChatGPT via the OpenAI API.
    If the text_data is too long, it splits it into chunks and sends each chunk separately.

    Args:
    - prompt (str, optional): The prompt to guide the model's response.
    - text_data (str, optional): Additional text data to be included.
    - max_tokens (int, optional): Maximum tokens for each API call. Default is 2500.

    Returns:
    - list or str: A list of model's responses for each chunk or an error message.
    """

    # Check if the necessary arguments are provided
    if not prompt:
        return "Error: Prompt is missing. Please provide a prompt."
    if not text_data:
        return "Error: Text data is missing. Please provide some text data."

    # Initialize the tokenizer
    tokenizer = tiktoken.encoding_for_model(chat_model)

    # Encode the text_data into token integers
    token_integers = tokenizer.encode(text_data)

    # Split the token integers into chunks based on max_tokens
    chunk_size = max_tokens - len(tokenizer.encode(prompt))
    chunks = [
        token_integers[i : i + chunk_size]
        for i in range(0, len(token_integers), chunk_size)
    ]

    # Decode token chunks back to strings
    chunks = [tokenizer.decode(chunk) for chunk in chunks]

    responses = []
    messages = [
        {"role": "user", "content": prompt},
        {
            "role": "user",
            "content": "To provide the context for the above prompt, I will send you text in parts. When I am finished, I will tell you 'ALL PARTS SENT'. Do not answer until you have received all the parts.",
        },
    ]

    for chunk in chunks:
        messages.append({"role": "user", "content": chunk})

        # Check if total tokens exceed the model's limit and remove oldest chunks if necessary
        while (
            sum(len(tokenizer.encode(msg["content"])) for msg in messages)
            > model_token_limit
        ):
            messages.pop(1)  # Remove the oldest chunk

        response = openai.ChatCompletion.create(model=chat_model, messages=messages)
        chatgpt_response = response.choices[0].message["content"].strip()
        responses.append(chatgpt_response)

    # Add the final "ALL PARTS SENT" message
    messages.append({"role": "user", "content": "ALL PARTS SENT"})
    response = openai.ChatCompletion.create(model=chat_model, messages=messages)
    final_response = response.choices[0].message["content"].strip()
    responses.append(final_response)

    return responses
```

Here's an example of how you can use this module with text data read from a file. (`chatgptmax` also provides a [convenience method](https://github.com/victoriadrake/chatgptmax/blob/4431af468435cd51d07779c6d721c8e0016d6bd6/chatgptmax.py#L68) for getting text from a file.)

```py
# First, import the necessary modules and the function
import os

from chatgptmax import send

# Define a function to read the content of a file
def read_file_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

# Use the function
if __name__ == "__main__":
    # Specify the path to your file
    file_path = "path_to_your_file.txt"
    
    # Read the content of the file
    file_content = read_file_content(file_path)
    
    # Define your prompt
    prompt_text = "Summarize the following text for me:"
    
    # Send the file content to ChatGPT
    responses = send(prompt=prompt_text, text_data=file_content)
    
    # Print the responses
    for response in responses:
        print(response)
```

### Error handling

While the module is designed to handle most standard use cases, there are potential pitfalls to be aware of:

- **Incomplete sentences**: If a chunk ends in the middle of a sentence, it might alter the meaning or context. To mitigate this, consider ensuring that chunks end at full stops or natural breaks in the text. You could do this by separating the text-chunking task into a separate function that:
  1. Splits the text into sentences.
  2. Iterates over the sentences and adds them to a chunk until the chunk reaches the maximum size.
  3. Starts a new chunk when the current chunk reaches the maximum size or when adding another sentence would exceed the maximum size.
- **API connectivity issues**: There's always a possibility of timeouts or connectivity problems during API calls. If this is a significant issue for your application, you can include retry logic in your code. If an API call fails, the script could wait for a few seconds and then try again, ensuring that all chunks are processed.
- **Rate limits**: Be mindful of [OpenAI API's rate limits](https://platform.openai.com/docs/guides/rate-limits/overview). If you're sending many chunks in rapid succession, you might hit these limits. Introducing a slight delay between calls or spreading out requests can help avoid this.

### Optimization

As with any process, there's always room for improvement. Here are a couple of ways you might optimize the module's chunking and sending process further:

- **Parallelizing API calls**: If [OpenAI API's rate limits](https://platform.openai.com/docs/guides/rate-limits/overview) and your infrastructure allow, you could send multiple chunks simultaneously. This parallel processing can speed up the overall time it takes to get responses for all chunks. Unless you have access to OpenAI's `32k` models or need to use small chunk sizes, however, parallelism gains are likely to be minimal.
- **Caching mechanisms**: If you find yourself sending the same or similar chunks frequently, consider implementing a caching system. By storing ChatGPT's responses for specific chunks, you can retrieve them instantly from the cache the next time, saving both time and API calls.

## Now what

If you found your way here via search, you probably already have a use case in mind. Here are some other (startup) ideas:

- **You're a researcher** who wants to save time by getting short summaries of many lengthy articles.
- **You're a legal professional** who wants to analyze long contracts by extracting key points or clauses.
- **You're a financial analyst** who wants to pull a quick overview of trends from a long report.
- **You're a writer** who wants feedback on a new article or chapter... without having to actually show it to anyone yet.

Do you have a use case I didn't list? [Let me know about it!](/contact) In the meantime, have fun sending lots of text to ChatGPT.
