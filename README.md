# Hangbot - a GroupMe bot that plays hangman

## IMPORTANT NOTE

You will need to edit the .env file by replacing the "INSERT ID HERE" with the GroupMe ID of your bot. This is required for the bot to work.

## Introduction

This is a Groupme bot that runs games of Hangman. Based in most part off [this tutorial and GitHub project](https://github.com/groupme/bot-tutorial-nodejs).

## Contents

  * [Functionality](#functionality)
  * [Commands](#commands)

# Functionality <a name="functionality"></a>

This bot can run games of Hangman in a GroupMe group. As with all bots, it cannot be added to a private message, only to an actual group chat.

Note that Heroku can be slow so sometimes commands take a while (~30 seconds) to be processed. Additionally the script does not persist for longer than a few hours, so games in progress might disappear.

# Commands <a name="functionality"></a>

## !play

This starts a new game. It can only be used if there is not a game in progress.

## !guess x

This is used to guess a letter. Replace "x" with the letter you want to guess. It is case insensitive and lets you know if you've already guessed a certain letter (with no penalty).

## !forfeit

This immediately ends a game as if you lost.

## !progress

This shows all progress made in the current game, including what letters have been guessed and how many letters are left. Useful if there have been messages in the chat since the last guess.

## !help

This shows a list of all commands.

## !about

This dislpays a brief message detailing the version number of the bot as well as information about its creators.
