---
title: Why I'm automatically deleting my old tweets using AWS Lambda
date: 2018-04-12T06:37:48-06:00

aliases:
    - /blog/why-im-automatically-deleting-my-old-tweets-using-aws-lambda/
description: From now on, my tweets are ephemeral. Here's why I'm deleting all my old tweets and the AWS Lambda function that does it for free. 
tags:
    - cloud
image: cover.webp
---

From now on, my tweets are ephemeral. Here's why I'm deleting all my old tweets and the AWS Lambda function that does it for free. 

# Stuff and opinions

I've only been a one-bag nomad for a little over a year and a half. Before that, I lived as most people do in an apartment or a house. I owned furniture, more clothing than I strictly needed, and enough "stuff" to fill at least a few moving boxes. If I went to live somewhere else, moving for school or family or work, I packed up all my things and brought them with me. Over the years, I accumulated more and more stuff.

Adopting what many would call a minimalist lifestyle has rapidly changed a lot of my longstanding views. Giving away all my stuff (an idea I once thought to be interesting in principle but practically a little bit ridiculous) has become normal. It's normal for me, now, to not own things that I don't use on a regular basis. I don't keep wall shelves packed with old books or dishes or clothing or childhood toys because those items aren't relevant to me anymore. I just keep fond memories, instead.

Imagine, for a moment, that I still lived in a house. Imagine that in that house, on the fridge, is a drawing I made when I was six-years-old. In the bottom right corner of that drawing scribbled in green crayon are the words "broccoli is dumb - Victoria, Age 6."

If you were in my house and saw that drawing on the fridge, would you assume that the statement "broccoli is dumb" comprised an accurate and current account of my opinions on broccoli? Of course not. I was six when I wrote that. I've had plenty of time to change my mind.

# Social media isn't social

I have a friend whom I've known since we were both in kindergarten. We went through grade school together, then spoke to and saw each other on infrequent occasions across the years. We're both adults now. Sometimes when we chat, we'll recall some amusing memory from when we were younger. The nature of memory being what it is, I have no illusion that what we recall is recounted with much accuracy. Our impressions of things that happened - mistakes we made and moments of victory alike - are coloured by the experiences we've had since then, and all the things we've learned. An awkward moment at a school colleague's birthday party becomes an example of a child learning to socialize, instead of the world-ending moment of embarrassment it probably felt like at the time.

This is how memory works. In a sense, it gets updated, as well it should. People living in small communities remember things that their neighbour did many years ago, but recall them in the context of who their neighbour is now, and what their current relationship is like. This re-colouring of history is an important part of how people [heal](https://www.smithsonianmag.com/science-nature/how-our-brains-make-memories-14466850/), [make good decisions](http://news.feinberg.northwestern.edu/2014/02/memory_rewrite/), and [socialize](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3709095/).

Social media does not do this. Your perfectly preserved tweet from five days or five years ago can be recalled with absolute accuracy. For most people, this is not particularly worrying. We tend to tweet about pretty mundane things - things that pop into mind when we're bored and want someone to notice us. Individually, usually, our old tweets are pretty insignificant. In aggregate, however, they paint a pretty complete picture of a person's random, unintentionally telling thoughts. This is the problem.

The assumption made of things written in social media and on Twitter specifically is a very different assumption than you might make about someone's notepad scribble from last week. I'm not endeavoring to speculate why - I've just seen enough cases of someone getting publicly flogged for something they posted years ago to know that it does happen. This is weird. If you wouldn't assume that a notepad scribble from last week or a crayon drawing from decades ago reflects the essence of who someone is _now,_ why would you assume that an old tweet does?

You are not the same person you were last month - you've seen things, read things, understood and learned things that have, in some small way, changed you. While a person may have the same sense of self and identity through most of their life, even this grows and changes over the years. We change our opinions, our desires, our habits. We are not stagnant beings, and we should not let ourselves be represented as such, however unintentionally.

# Ephemeral tweets

If you look at my Twitter profile page today, you'll see fewer tweets there than you have fingers (I hope). I'm using [ephemeral](https://github.com/victoriadotdev/ephemeral) - a lightweight utility I wrote for use on [AWS Lambda](https://aws.amazon.com/lambda/) - to delete all my tweets older than a few days. I'm doing this for the same reason that I don't hang on to stuff that I no longer use - that stuff isn't relevant to me anymore. It doesn't represent me, either.

The code that makes up ephemeral is written in Go. AWS Lambda creates an environment for each Lambda function, so ephemeral utilizes environment variables for your private Twitter API keys and the maximum age of the tweets you want to keep, represented in hours, like `72h`.

```golang
var (
	consumerKey       = getenv("TWITTER_CONSUMER_KEY")
	consumerSecret    = getenv("TWITTER_CONSUMER_SECRET")
	accessToken       = getenv("TWITTER_ACCESS_TOKEN")
	accessTokenSecret = getenv("TWITTER_ACCESS_TOKEN_SECRET")
	maxTweetAge       = getenv("MAX_TWEET_AGE")
	logger            = log.New()
)

func getenv(name string) string {
	v := os.Getenv(name)
	if v == "" {
		panic("missing required environment variable " + name)
	}
	return v
}
```

The program uses the [anaconda](https://github.com/ChimeraCoder/anaconda) library. It fetches your timeline up to the Twitter API's limit of 200 tweets per request, then compares each tweet's date of creation to your `MAX_TWEET_AGE` variable to decide whether it's old enough to be deleted. After deleting all the expired tweets, the Lambda function terminates.

```golang
func deleteFromTimeline(api *anaconda.TwitterApi, ageLimit time.Duration) {
	timeline, err := getTimeline(api)

	if err != nil {
		log.Error("Could not get timeline")
	}
	for _, t := range timeline {
		createdTime, err := t.CreatedAtTime()
		if err != nil {
			log.Error("Couldn't parse time ", err)
		} else {
			if time.Since(createdTime) > ageLimit {
				_, err := api.DeleteTweet(t.Id, true)
				log.Info("DELETED: Age - ", time.Since(createdTime).Round(1*time.Minute), " - ", t.Text)
				if err != nil {
					log.Error("Failed to delete! ", err)
				}
			}
		}
	}
	log.Info("No more tweets to delete.")

}
```

Read the full code [here](https://github.com/victoriadotdev/ephemeral/blob/master/main.go).

For a use case like this, AWS Lambda has a free tier that costs nothing. If you're any level of developer, it's an extremely useful tool to become familiar with. For a full walkthrough with screenshots of how to set up a Lambda function that tweets for you, you can read [this article](https://victoria.dev/verbose/aws-lambda/). The set up for ephemeral is the same, it just has an opposite function. :)

I forked ephemeral from Adam Drake's [Harold](https://github.com/adamdrake/harold), a Twitter tool that has many useful functions beyond keeping your timeline trimmed. If you have more than 200 tweets to delete at first pass, please use Harold to do that first. You can run Harold with the `deletetimeline` flag from your terminal.

For sentiment, you may like to [download all your tweets before deleting them](https://twitter.com/settings/your_twitter_data).

# Why use Twitter at all?

In anticipation of the question, let me say that yes, I do use Twitter besides just as a bucket for my Lambda functions to fill and empty. It has its benefits, most related to what I perceive to be its original intended purpose: to be a means of near-instant communication for short, digestible pieces of information reaching a widespread pool of people.

I use it as a way to keep tabs on what's happening _right now._ I use it to comment on, joke about, and commiserate with things tweeted by the people I follow _right now._ By keeping my timeline restricted to only the most recent few days, I feel like I'm using Twitter more like it was meant to be used: a way to join the conversation and see what's happening in the world _right now_ - instead of just another place to amass more "stuff."
